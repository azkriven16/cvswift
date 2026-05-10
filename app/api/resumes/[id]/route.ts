import { NextResponse } from "next/server";
import { setupError } from "@/lib/env";
import { readJsonBody } from "@/lib/http";
import { getResumeById, updateResume } from "@/lib/services/resumes";
import { requireUser } from "@/lib/supabase/server";
import type { Json } from "@/lib/supabase/types";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const result = await getResumeById(id);

  if ("error" in result) {
    if (result.error === "setup") return NextResponse.json(setupError(result.setupMissing), { status: 503 });
    if (result.error === "unauthorized") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (result.error === "not_found") return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }

  return NextResponse.json({ resume: result.resume });
}

export async function PUT(request: Request, { params }: Params) {
  const { id } = await params;

  const { data: body, error: bodyError } = await readJsonBody<{
    title?: string;
    targetRole?: string;
    content?: Record<string, unknown>;
    templateId?: string;
  }>(request, {});

  if (bodyError) return NextResponse.json({ error: bodyError }, { status: 413 });

  const result = await updateResume(id, {
    title: body.title,
    targetRole: body.targetRole,
    content: body.content as Json | undefined,
    templateId: body.templateId,
  });

  if ("error" in result) {
    if (result.error === "setup") return NextResponse.json(setupError(result.setupMissing), { status: 503 });
    if (result.error === "unauthorized") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: result.message }, { status: 500 });
  }

  return NextResponse.json({ resume: result.resume });
}

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params;
  const { supabase, user, setupMissing } = await requireUser();

  if (setupMissing.length) return NextResponse.json(setupError(setupMissing), { status: 503 });
  if (!user || !supabase) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { error } = await supabase
    .from("resumes")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return new NextResponse(null, { status: 204 });
}
