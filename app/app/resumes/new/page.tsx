import { ResumeEditor } from "@/components/resume-editor";
import { AuthRequired } from "@/components/auth-required";
import { SetupRequired } from "@/components/setup-required";
import { hasSupabaseEnv } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function NewResumePage() {
  if (!hasSupabaseEnv()) {
    return <SetupRequired missing={["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"]} />;
  }

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase!.auth.getUser();

  if (!data.user) return <AuthRequired />;

  return (
    <main>
      <ResumeEditor />
    </main>
  );
}
