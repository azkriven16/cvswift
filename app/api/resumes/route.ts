import { NextResponse } from "next/server";
import { setupError } from "@/lib/env";
import { readJsonBody } from "@/lib/http";
import { createResume, listCurrentUserResumes } from "@/lib/services/resumes";
import type { Json } from "@/lib/supabase/types";

export async function GET() {
  const result = await listCurrentUserResumes();

  if ("error" in result) {
    if (result.error === "setup") return NextResponse.json(setupError(result.setupMissing), { status: 503 });
    if (result.error === "unauthorized") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: result.message }, { status: 500 });
  }

  return NextResponse.json({ resumes: result.resumes });
}

export async function POST(request: Request) {
  const { data: body, error: bodyError } = await readJsonBody<{
    title?: string;
    targetRole?: string;
    content?: Record<string, unknown>;
  }>(request, {});

  if (bodyError) return NextResponse.json({ error: bodyError }, { status: 413 });

  if (!body.title) return NextResponse.json({ error: "title is required" }, { status: 400 });

  const result = await createResume({
    title: body.title,
    targetRole: body.targetRole,
    content: (body.content ?? {}) as Json,
  });

  if ("error" in result) {
    if (result.error === "setup") return NextResponse.json(setupError(result.setupMissing), { status: 503 });
    if (result.error === "unauthorized") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (result.error === "limit") return NextResponse.json({ error: result.message }, { status: 429 });
    return NextResponse.json({ error: result.message }, { status: 500 });
  }

  return NextResponse.json({ resume: result.resume }, { status: 201 });
}
