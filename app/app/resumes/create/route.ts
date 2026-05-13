import { NextResponse } from "next/server";
import { createResume } from "@/lib/services/resumes";

export async function GET(request: Request) {
  const result = await createResume({ title: "Untitled Resume" });
  const base = new URL(request.url).origin;

  console.log("[create-resume]", JSON.stringify(result));

  if ("resume" in result && result.resume) {
    return NextResponse.redirect(`${base}/app/resumes/${result.resume.id}`);
  }

  return NextResponse.json({ error: result }, { status: 400 });
}
