import { NextResponse } from "next/server";
import { readJsonBody } from "@/lib/http";

export async function POST(request: Request) {
  const { error } = await readJsonBody(request, {});
  if (error) return NextResponse.json({ error }, { status: 413 });

  return NextResponse.json(
    {
      error: "AI rewrites are planned after the free audit flow is live.",
      message: "For the free hosted MVP, only resume audits should call OpenRouter.",
    },
    { status: 501 }
  );
}
