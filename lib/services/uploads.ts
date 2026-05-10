import { ALLOWED_UPLOAD_TYPES, FREE_UPLOAD_LIMIT, FREE_UPLOAD_MAX_BYTES } from "@/lib/config";
import { requireUser } from "@/lib/supabase/server";

export async function uploadResumeSource(file: File, resumeId?: string) {
  const { supabase, user, setupMissing } = await requireUser();
  if (setupMissing.length) return { error: "setup" as const, setupMissing };
  if (!user || !supabase) return { error: "unauthorized" as const };

  if (file.size > FREE_UPLOAD_MAX_BYTES) {
    return { error: "limit" as const, message: "File must be 2 MB or smaller." };
  }

  if (!ALLOWED_UPLOAD_TYPES.includes(file.type)) {
    return { error: "invalid" as const, message: "Only PDF, DOCX, and TXT files are allowed." };
  }

  const { count, error: countError } = await supabase
    .from("uploads")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  if (countError) return { error: "database" as const, message: countError.message };
  if ((count ?? 0) >= FREE_UPLOAD_LIMIT) return { error: "limit" as const, message: "Free upload limit reached." };

  const extension = file.name.split(".").pop()?.toLowerCase() || "upload";
  const fileId = crypto.randomUUID();
  const path = `${user.id}/${fileId}.${extension}`;

  const { error: uploadError } = await supabase.storage.from("resume_uploads").upload(path, file, {
    contentType: file.type,
    upsert: false,
  });

  if (uploadError) return { error: "storage" as const, message: uploadError.message };

  const { data, error } = await supabase
    .from("uploads")
    .insert({
      user_id: user.id,
      resume_id: resumeId ?? null,
      path,
      mime_type: file.type,
      size_bytes: file.size,
    })
    .select("*")
    .single();

  if (error) return { error: "database" as const, message: error.message };

  return { upload: data };
}
