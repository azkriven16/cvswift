import { NextResponse } from "next/server";
import { setupError, getEnv, hasOpenRouterEnv } from "@/lib/env";
import { readJsonBody } from "@/lib/http";
import { requireUser } from "@/lib/supabase/server";
import { FREE_DAILY_AUDIT_LIMIT } from "@/lib/config";
import { getResumeById } from "@/lib/services/resumes";
import { normalizeResumeContent, type ResumeContent } from "@/lib/resume/schema";

function todayIsoStart() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date.toISOString();
}

function parseResumeResult(text: string): ResumeContent | null {
  try {
    const parsed = JSON.parse(text) as unknown;
    if (parsed && typeof parsed === "object") return normalizeResumeContent(parsed);
  } catch {
    // fall through
  }
  return null;
}

export async function POST(request: Request) {
  const { data: body, error: bodyError } = await readJsonBody<{
    resumeId?: string;
    jobPost?: string;
  }>(request, {});

  if (bodyError) return NextResponse.json({ error: bodyError }, { status: 413 });
  if (!body.resumeId) return NextResponse.json({ error: "resumeId is required" }, { status: 400 });
  if (!body.jobPost?.trim()) return NextResponse.json({ error: "jobPost is required" }, { status: 400 });

  const { supabase, user, setupMissing } = await requireUser();
  if (setupMissing.length) return NextResponse.json(setupError(setupMissing), { status: 503 });
  if (!user || !supabase) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!hasOpenRouterEnv()) return NextResponse.json(setupError(["OPENROUTER_API_KEY"]), { status: 503 });

  const { count, error: usageError } = await supabase
    .from("ai_usage_events")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("kind", "resume_tailor")
    .gte("created_at", todayIsoStart());

  if (usageError) return NextResponse.json({ error: usageError.message }, { status: 500 });
  if ((count ?? 0) >= FREE_DAILY_AUDIT_LIMIT) {
    return NextResponse.json({ error: "Daily free tailoring limit reached." }, { status: 429 });
  }

  const resumeResult = await getResumeById(body.resumeId);
  if ("error" in resumeResult) return NextResponse.json({ error: "Resume not found" }, { status: 404 });

  const current = normalizeResumeContent(resumeResult.resume.content);
  const model = getEnv("OPENROUTER_MODEL") || "meta-llama/llama-3.2-3b-instruct:free";

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getEnv("OPENROUTER_API_KEY")}`,
      "Content-Type": "application/json",
      "HTTP-Referer": getEnv("NEXT_PUBLIC_APP_URL") || "http://localhost:3002",
      "X-Title": "CVSwift",
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "system",
          content:
            "You tailor resumes to job postings. Return only valid JSON matching the exact shape of the input resume. Rewrite the summary, experience bullets, and skills to match the job post keywords and requirements. Preserve name, email, location, links, job titles, company names, dates, and education. Do not add new sections.",
        },
        {
          role: "user",
          content: JSON.stringify({ jobPost: body.jobPost, currentResume: current }),
        },
      ],
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) return NextResponse.json({ error: "AI service error." }, { status: 502 });

  const data = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
  const text = data.choices?.[0]?.message?.content ?? "";
  const tailored = parseResumeResult(text);

  if (!tailored) return NextResponse.json({ error: "AI returned an unreadable response." }, { status: 422 });

  await supabase.from("ai_usage_events").insert({
    user_id: user.id,
    kind: "resume_tailor",
    provider: "openrouter",
  });

  return NextResponse.json({ resume: tailored });
}
