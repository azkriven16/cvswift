import { FREE_DAILY_AUDIT_LIMIT } from "@/lib/config";
import { getEnv, hasOpenRouterEnv } from "@/lib/env";
import type { Json } from "@/lib/supabase/types";
import { requireUser } from "@/lib/supabase/server";
import { recordIpAuditUsage } from "@/lib/services/ip-rate-limit";

type AuditResult = {
  score: number;
  summary: string;
  categories: Array<{ label: string; score: number; note: string }>;
  suggestions: string[];
  detected_keywords?: string[];
  suggested_keywords?: string[];
  is_fallback?: boolean;
};

const fallbackAudit: AuditResult = {
  score: 78,
  summary: "The resume is readable, but needs stronger quantified impact and tighter role alignment.",
  categories: [
    { label: "Impact", score: 72, note: "Add measurable outcomes to experience bullets." },
    { label: "ATS Match", score: 80, note: "Include role-specific keywords naturally." },
    { label: "Clarity", score: 84, note: "Structure is clear and scannable." },
    { label: "Seniority", score: 76, note: "Show ownership, scope, and decision-making." },
  ],
  suggestions: [
    "Rewrite the summary to match the target role.",
    "Add metrics to the top two experience bullets.",
  ],
  detected_keywords: ["React", "TypeScript", "Next.js"],
  suggested_keywords: ["Node.js", "CI/CD", "system design"],
};

function todayIsoStart() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date.toISOString();
}

function parseAuditResult(text: string): AuditResult {
  try {
    const parsed = JSON.parse(text) as AuditResult;
    if (typeof parsed.score === "number" && Array.isArray(parsed.categories)) return parsed;
  } catch {
    // fall through
  }

  return { ...fallbackAudit, is_fallback: true };
}

async function callOpenRouter(resumeContent: Json, targetRole: string | null) {
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
            "You audit resumes. Return only valid JSON with: score (0-100), summary, categories (array of {label, score, note}), suggestions (array of strings), detected_keywords (array of strong ATS keywords already present in the resume), and suggested_keywords (array of keywords that would strengthen this resume for the target role). Do not include markdown.",
        },
        {
          role: "user",
          content: JSON.stringify({
            targetRole,
            resumeContent,
            requiredShape: fallbackAudit,
          }),
        },
      ],
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenRouter request failed: ${response.status}`);
  }

  const data = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
  return parseAuditResult(data.choices?.[0]?.message?.content ?? "");
}

export async function runResumeAudit(resumeId: string, ipHash: string) {
  const { supabase, user, setupMissing } = await requireUser();
  if (setupMissing.length) return { error: "setup" as const, setupMissing };
  if (!user || !supabase) return { error: "unauthorized" as const };
  if (!hasOpenRouterEnv()) return { error: "setup" as const, setupMissing: ["OPENROUTER_API_KEY"] };

  const { count, error: usageError } = await supabase
    .from("ai_usage_events")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("kind", "resume_audit")
    .gte("created_at", todayIsoStart());

  if (usageError) return { error: "database" as const, message: usageError.message };
  if ((count ?? 0) >= FREE_DAILY_AUDIT_LIMIT) return { error: "limit" as const, message: "Daily free audit limit reached." };

  const { data: resume, error: resumeError } = await supabase
    .from("resumes")
    .select("*")
    .eq("id", resumeId)
    .eq("user_id", user.id)
    .single();

  if (resumeError) return { error: "database" as const, message: resumeError.message };

  const result = await callOpenRouter(resume.content, resume.target_role);

  const { data: audit, error: auditError } = await supabase
    .from("resume_audits")
    .insert({
      user_id: user.id,
      resume_id: resume.id,
      score: result.score,
      result: result as unknown as Json,
    })
    .select("*")
    .single();

  if (auditError) return { error: "database" as const, message: auditError.message };

  await supabase.from("ai_usage_events").insert({
    user_id: user.id,
    kind: "resume_audit",
    provider: "openrouter",
  });
  await recordIpAuditUsage(ipHash, user.id);

  return { audit, result };
}

export async function listAuditsByResumeId(resumeId: string) {
  const { supabase, user, setupMissing } = await requireUser();
  if (setupMissing.length) return { error: "setup" as const, setupMissing };
  if (!user || !supabase) return { error: "unauthorized" as const };

  const { data, error } = await supabase
    .from("resume_audits")
    .select("*")
    .eq("resume_id", resumeId)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) return { error: "database" as const, message: error.message };
  return { audits: data };
}
