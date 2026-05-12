import { NextResponse } from "next/server";
import { setupError, getEnv } from "@/lib/env";
import { readJsonBody } from "@/lib/http";
import { requireUser } from "@/lib/supabase/server";
import { normalizeResumeContent, type ResumeContent } from "@/lib/resume/schema";
import { FREE_DAILY_COPILOT_LIMIT } from "@/lib/config";
import { checkIpLimit, recordIpLimit, getClientIp } from "@/lib/services/ip-rate-limit";

const SYSTEM_PROMPT = `You are a resume editor. Apply the user's instruction to the resume data and return a JSON object with these optional fields:
- "resume": updated resume content (same shape as input, include ALL fields even unchanged ones)
- "title": new document title (only if the instruction changes the document name/title)
- "targetRole": new target role (only if the instruction changes the role)
- "message": one sentence describing exactly which fields or sections were changed (e.g. "Updated the summary and rewrote 3 experience bullets with stronger impact language.")

Return ONLY valid JSON, no markdown, no explanation.`;

const MAX_INSTRUCTION_LENGTH = 500;
const IP_DAILY_COPILOT_LIMIT = 30;

function todayIsoStart() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

export async function POST(request: Request) {
  const { data: body, error: bodyError } = await readJsonBody<{
    instruction?: string;
    resume?: unknown;
    title?: string;
    targetRole?: string;
  }>(request, {});

  if (bodyError) return NextResponse.json({ error: bodyError }, { status: 413 });
  if (!body.instruction?.trim()) return NextResponse.json({ error: "instruction is required" }, { status: 400 });
  if (body.instruction.length > MAX_INSTRUCTION_LENGTH) {
    return NextResponse.json({ error: `Instruction must be ${MAX_INSTRUCTION_LENGTH} characters or fewer.` }, { status: 400 });
  }

  const { supabase, user, setupMissing } = await requireUser();
  if (setupMissing.length) return NextResponse.json(setupError(setupMissing), { status: 503 });
  if (!user || !supabase) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // User-level daily limit
  const { count, error: usageError } = await supabase
    .from("ai_usage_events")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("kind", "copilot")
    .gte("created_at", todayIsoStart());

  if (usageError) return NextResponse.json({ error: usageError.message }, { status: 500 });
  if ((count ?? 0) >= FREE_DAILY_COPILOT_LIMIT) {
    return NextResponse.json({ error: `Daily copilot limit of ${FREE_DAILY_COPILOT_LIMIT} reached. Resets at midnight.` }, { status: 429 });
  }

  // IP-level daily limit
  const ip = getClientIp(request);
  const ipCheck = await checkIpLimit(ip, "copilot", IP_DAILY_COPILOT_LIMIT);
  if ("error" in ipCheck) {
    if (ipCheck.error === "setup") return NextResponse.json(setupError(ipCheck.setupMissing), { status: 503 });
    if (ipCheck.error === "limit") return NextResponse.json({ error: "Daily copilot limit reached for this network. Resets at midnight." }, { status: 429 });
    return NextResponse.json({ error: ipCheck.message }, { status: 500 });
  }

  const apiKey = getEnv("GEMINI_API_KEY");
  if (!apiKey) return NextResponse.json(setupError(["GEMINI_API_KEY"]), { status: 503 });

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{
          parts: [{
            text: JSON.stringify({
              instruction: body.instruction,
              currentTitle: body.title,
              currentTargetRole: body.targetRole,
              resume: body.resume,
            }),
          }],
        }],
        generationConfig: { responseMimeType: "application/json" },
      }),
    }
  );

  if (!response.ok) {
    const errBody = await response.text();
    console.error("[copilot] Gemini error", response.status, errBody);
    return NextResponse.json({ error: "AI service error." }, { status: 502 });
  }

  const data = (await response.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

  let parsed: { resume?: unknown; title?: string; targetRole?: string; message?: string };
  try {
    parsed = JSON.parse(text) as typeof parsed;
  } catch {
    return NextResponse.json({ error: "AI returned unreadable response." }, { status: 422 });
  }

  const result: { resume?: ResumeContent; title?: string; targetRole?: string; message?: string } = {};
  if (parsed.resume) result.resume = normalizeResumeContent(parsed.resume);
  if (parsed.title) result.title = String(parsed.title);
  if (parsed.targetRole) result.targetRole = String(parsed.targetRole);
  result.message = parsed.message ?? "Done.";

  // Record usage only on success
  await Promise.all([
    supabase.from("ai_usage_events").insert({ user_id: user.id, kind: "copilot", provider: "gemini" }),
    recordIpLimit(ipCheck.ipHash, user.id, "copilot"),
  ]);

  return NextResponse.json(result);
}
