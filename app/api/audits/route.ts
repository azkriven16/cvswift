import { NextResponse } from "next/server";
import { setupError } from "@/lib/env";
import { readJsonBody } from "@/lib/http";
import { runResumeAudit } from "@/lib/services/audits";
import { checkIpAuditLimit, getClientIp } from "@/lib/services/ip-rate-limit";

export async function POST(request: Request) {
  const { data: body, error: bodyError } = await readJsonBody<{ resumeId?: string }>(request, {});
  if (bodyError) return NextResponse.json({ error: bodyError }, { status: 413 });

  if (!body.resumeId) return NextResponse.json({ error: "resumeId is required" }, { status: 400 });

  const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!UUID_RE.test(body.resumeId)) {
    return NextResponse.json({ error: "resumeId must be a valid UUID" }, { status: 400 });
  }

  const ipLimit = await checkIpAuditLimit(getClientIp(request));
  if ("error" in ipLimit) {
    if (ipLimit.error === "setup") return NextResponse.json(setupError(ipLimit.setupMissing), { status: 503 });
    if (ipLimit.error === "limit") return NextResponse.json({ error: ipLimit.message }, { status: 429 });
    return NextResponse.json({ error: ipLimit.message }, { status: 500 });
  }

  const result = await runResumeAudit(body.resumeId, ipLimit.ipHash);

  if ("error" in result) {
    if (result.error === "setup") return NextResponse.json(setupError(result.setupMissing), { status: 503 });
    if (result.error === "unauthorized") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (result.error === "limit") return NextResponse.json({ error: result.message }, { status: 429 });
    return NextResponse.json({ error: result.message }, { status: 500 });
  }

  return NextResponse.json(result);
}
