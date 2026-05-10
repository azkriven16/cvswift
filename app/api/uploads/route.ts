import { NextResponse } from "next/server";
import { setupError } from "@/lib/env";
import { uploadResumeSource } from "@/lib/services/uploads";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");
  const resumeId = formData.get("resumeId");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "file is required" }, { status: 400 });
  }

  const result = await uploadResumeSource(file, typeof resumeId === "string" ? resumeId : undefined);

  if ("error" in result) {
    if (result.error === "setup") return NextResponse.json(setupError(result.setupMissing), { status: 503 });
    if (result.error === "unauthorized") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (result.error === "limit") return NextResponse.json({ error: result.message }, { status: 429 });
    if (result.error === "invalid") return NextResponse.json({ error: result.message }, { status: 400 });
    return NextResponse.json({ error: result.message }, { status: 500 });
  }

  return NextResponse.json(result, { status: 201 });
}
