import { redirect } from "next/navigation";
import { createResume } from "@/lib/services/resumes";

export async function GET() {
  const result = await createResume({ title: "Untitled Resume" });
  if ("resume" in result && result.resume) {
    redirect(`/app/resumes/${result.resume.id}`);
  }
  redirect("/app/resumes");
}
