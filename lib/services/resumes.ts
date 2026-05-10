import { FREE_RESUME_LIMIT } from "@/lib/config";
import type { Json } from "@/lib/supabase/types";
import { requireUser } from "@/lib/supabase/server";

export async function listCurrentUserResumes() {
  const { supabase, user, setupMissing } = await requireUser();
  if (setupMissing.length) return { error: "setup" as const, setupMissing };
  if (!user || !supabase) return { error: "unauthorized" as const };

  const { data, error } = await supabase
    .from("resumes")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) return { error: "database" as const, message: error.message };

  return { user, resumes: data };
}

export async function getResumeById(id: string) {
  const { supabase, user, setupMissing } = await requireUser();
  if (setupMissing.length) return { error: "setup" as const, setupMissing };
  if (!user || !supabase) return { error: "unauthorized" as const };

  const { data, error } = await supabase
    .from("resumes")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) return { error: "not_found" as const };

  return { user, resume: data };
}

export async function updateResume(
  id: string,
  input: { title?: string; targetRole?: string; content?: Json; templateId?: string },
) {
  const { supabase, user, setupMissing } = await requireUser();
  if (setupMissing.length) return { error: "setup" as const, setupMissing };
  if (!user || !supabase) return { error: "unauthorized" as const };

  const { data, error } = await supabase
    .from("resumes")
    .update({
      ...(input.title !== undefined && { title: input.title }),
      ...(input.targetRole !== undefined && { target_role: input.targetRole }),
      ...(input.content !== undefined && { content: input.content }),
      ...(input.templateId !== undefined && { template_id: input.templateId }),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", user.id)
    .select("*")
    .single();

  if (error || !data) return { error: "database" as const, message: error?.message };

  return { user, resume: data };
}

export async function createResume(input: { title: string; targetRole?: string; content?: Json }) {
  const { supabase, user, setupMissing } = await requireUser();
  if (setupMissing.length) return { error: "setup" as const, setupMissing };
  if (!user || !supabase) return { error: "unauthorized" as const };

  const { count, error: countError } = await supabase
    .from("resumes")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  if (countError) return { error: "database" as const, message: countError.message };
  if ((count ?? 0) >= FREE_RESUME_LIMIT) return { error: "limit" as const, message: "Free resume limit reached." };

  const { data, error } = await supabase
    .from("resumes")
    .insert({
      user_id: user.id,
      title: input.title,
      target_role: input.targetRole ?? null,
      content: input.content ?? {},
    })
    .select("*")
    .single();

  if (error) return { error: "database" as const, message: error.message };

  return { user, resume: data };
}
