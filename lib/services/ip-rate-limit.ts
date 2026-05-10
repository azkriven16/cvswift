import { createHash } from "crypto";
import { FREE_DAILY_AUDIT_LIMIT } from "@/lib/config";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

function todayIsoStart() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date.toISOString();
}

export function getClientIp(request: Request) {
  // Prefer headers set by the edge layer — these cannot be spoofed by clients.
  // x-vercel-forwarded-for: injected by Vercel's edge network
  // cf-connecting-ip: injected by Cloudflare
  // x-real-ip: set by nginx/HAProxy upstream (trusted only behind a controlled proxy)
  // x-forwarded-for: last resort — client-controllable without a trusted proxy
  const vercelIp = request.headers.get("x-vercel-forwarded-for");
  if (vercelIp) return vercelIp.split(",")[0]?.trim() || "unknown";

  const cfIp = request.headers.get("cf-connecting-ip");
  if (cfIp) return cfIp.trim();

  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]?.trim() || "unknown";

  return "unknown";
}

export function hashIp(ip: string) {
  return createHash("sha256").update(ip).digest("hex");
}

export async function checkIpAuditLimit(ip: string) {
  const supabase = createSupabaseAdminClient();
  if (!supabase) return { error: "setup" as const, setupMissing: ["SUPABASE_SERVICE_ROLE_KEY"] };

  const ipHash = hashIp(ip);
  const { count, error } = await supabase
    .from("rate_limit_events")
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .eq("kind", "resume_audit")
    .gte("created_at", todayIsoStart());

  if (error) return { error: "database" as const, message: error.message };
  if ((count ?? 0) >= FREE_DAILY_AUDIT_LIMIT) return { error: "limit" as const, message: "Daily audit limit reached for this network." };

  return { ipHash };
}

export async function recordIpAuditUsage(ipHash: string, userId: string) {
  const supabase = createSupabaseAdminClient();
  if (!supabase) return;

  await supabase.from("rate_limit_events").insert({
    ip_hash: ipHash,
    user_id: userId,
    kind: "resume_audit",
  });
}
