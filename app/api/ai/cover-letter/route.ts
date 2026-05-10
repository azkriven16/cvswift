import { NextResponse } from "next/server";
import { setupError, getEnv, hasOpenRouterEnv } from "@/lib/env";
import { readJsonBody } from "@/lib/http";
import { requireUser } from "@/lib/supabase/server";
import { FREE_DAILY_AUDIT_LIMIT } from "@/lib/config";
import { getResumeById } from "@/lib/services/resumes";
import { normalizeResumeContent } from "@/lib/resume/schema";

function todayIsoStart() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date.toISOString();
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
    .eq("kind", "cover_letter")
    .gte("created_at", todayIsoStart());

  if (usageError) return NextResponse.json({ error: usageError.message }, { status: 500 });
  if ((count ?? 0) >= FREE_DAILY_AUDIT_LIMIT) {
    return NextResponse.json({ error: "Daily free cover letter limit reached." }, { status: 429 });
  }

  const resumeResult = await getResumeById(body.resumeId);
  if ("error" in resumeResult) return NextResponse.json({ error: "Resume not found" }, { status: 404 });

  const resume = normalizeResumeContent(resumeResult.resume.content);
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
            "You write concise, professional cover letters. Return only the cover letter text — no subject lines, no JSON, no markdown. Three short paragraphs: opening that shows genuine interest and fit, middle that highlights two specific accomplishments from the resume that match the job, closing that requests an interview. Keep it under 250 words.",
        },
        {
          role: "user",
          content: JSON.stringify({ jobPost: body.jobPost, resume }),
        },
      ],
    }),
  });

  if (!response.ok) return NextResponse.json({ error: "AI service error." }, { status: 502 });

  const data = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
  const coverLetter = data.choices?.[0]?.message?.content?.trim() ?? "";

  if (!coverLetter) return NextResponse.json({ error: "AI returned an empty response." }, { status: 422 });

  await supabase.from("ai_usage_events").insert({
    user_id: user.id,
    kind: "cover_letter",
    provider: "openrouter",
  });

  return NextResponse.json({ coverLetter });
}
