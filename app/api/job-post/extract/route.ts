import { NextResponse } from "next/server";
import { createWorker } from "tesseract.js";
import { getEnv, setupError } from "@/lib/env";
import { requireUser } from "@/lib/supabase/server";

export const runtime = "nodejs";

const MAX_UPLOAD_BYTES = 6 * 1024 * 1024;
const MIN_USEFUL_OCR_LENGTH = 40;

function isTextFile(file: File) {
  return file.type.startsWith("text/") || /\.(txt|md|json)$/i.test(file.name);
}

function isImageFile(file: File) {
  return file.type.startsWith("image/");
}

function isPdfFile(file: File) {
  return file.type === "application/pdf" || /\.pdf$/i.test(file.name);
}

function isDocxFile(file: File) {
  return (
    file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    /\.docx$/i.test(file.name)
  );
}

async function imageToDataUrl(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());
  return `data:${file.type || "image/png"};base64,${buffer.toString("base64")}`;
}

async function imageToBuffer(file: File) {
  return Buffer.from(await file.arrayBuffer());
}

async function extractWithTesseract(file: File) {
  const worker = await createWorker("eng");

  try {
    const result = await worker.recognize(await imageToBuffer(file));
    return result.data.text.trim();
  } finally {
    await worker.terminate();
  }
}

async function extractFromPdf(file: File): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const pdfParse = require("pdf-parse") as (buffer: Buffer) => Promise<{ text: string }>;
  const buffer = Buffer.from(await file.arrayBuffer());
  const result = await pdfParse(buffer);
  return result.text.trim();
}

async function extractFromDocx(file: File): Promise<string> {
  const mammoth = await import("mammoth");
  const buffer = Buffer.from(await file.arrayBuffer());
  const result = await mammoth.extractRawText({ buffer });
  return result.value.trim();
}

async function extractWithOpenRouter(file: File, kind: "job post" | "resume") {
  const apiKey = getEnv("OPENROUTER_API_KEY");
  const model = getEnv("OPENROUTER_VISION_MODEL") || "openrouter/free";

  if (!apiKey) {
    return {
      response: NextResponse.json(setupError(["OPENROUTER_API_KEY"]), { status: 501 }),
      text: "",
    };
  }

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "system",
          content: `Extract the ${kind} text from the image. Return only the extracted text, with readable line breaks. Do not summarize.`,
        },
        {
          role: "user",
          content: [
            { type: "text", text: `Extract all visible ${kind} text from this image.` },
            { type: "image_url", image_url: { url: await imageToDataUrl(file) } },
          ],
        },
      ],
      temperature: 0,
    }),
  });

  if (!response.ok) {
    return {
      response: NextResponse.json({ error: "Could not extract text from image." }, { status: response.status }),
      text: "",
    };
  }

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  return { response: null, text: payload.choices?.[0]?.message?.content?.trim() ?? "" };
}

export async function POST(request: Request) {
  const { user, setupMissing } = await requireUser();
  if (setupMissing.length) return NextResponse.json(setupError(setupMissing), { status: 503 });
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("file");
  const kind = formData.get("kind") === "resume" ? "resume" : "job post";

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "file is required" }, { status: 400 });
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ error: "Uploaded file must be 6MB or smaller." }, { status: 413 });
  }

  if (isTextFile(file)) {
    return NextResponse.json({ text: await file.text(), source: "text" });
  }

  if (isPdfFile(file)) {
    const text = await extractFromPdf(file).catch(() => "");
    if (text.length >= MIN_USEFUL_OCR_LENGTH) {
      return NextResponse.json({ text, source: "pdf-parse" });
    }
    const fallback = await extractWithOpenRouter(file, kind);
    if (fallback.response) return fallback.response;
    if (!fallback.text) return NextResponse.json({ error: "Could not extract text from PDF." }, { status: 422 });
    return NextResponse.json({ text: fallback.text, source: "openrouter" });
  }

  if (isDocxFile(file)) {
    const text = await extractFromDocx(file).catch(() => "");
    if (!text) return NextResponse.json({ error: "Could not extract text from DOCX." }, { status: 422 });
    return NextResponse.json({ text, source: "mammoth" });
  }

  if (!isImageFile(file)) {
    return NextResponse.json({ error: "Upload a PDF, DOCX, TXT, or image file." }, { status: 400 });
  }

  const tesseractText = await extractWithTesseract(file).catch(() => "");
  if (tesseractText.length >= MIN_USEFUL_OCR_LENGTH) {
    return NextResponse.json({ text: tesseractText, source: "tesseract" });
  }

  const fallback = await extractWithOpenRouter(file, kind);
  if (fallback.response) return fallback.response;

  if (!fallback.text) {
    return NextResponse.json({ error: "No text was extracted from the image." }, { status: 422 });
  }

  return NextResponse.json({ text: fallback.text, source: "openrouter" });
}
