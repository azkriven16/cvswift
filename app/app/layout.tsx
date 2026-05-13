import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { hasSupabaseEnv } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { listCurrentUserResumes } from "@/lib/services/resumes";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  let userEmail: string | undefined;
  let recents: Array<{ id: string; title: string }> = [];

  if (hasSupabaseEnv()) {
    const supabase = await createSupabaseServerClient();
    if (supabase) {
      const { data } = await supabase.auth.getUser();
      userEmail = data.user?.email ?? undefined;

      if (data.user) {
        const result = await listCurrentUserResumes();
        if ("resumes" in result && result.resumes) {
          recents = result.resumes.slice(0, 5).map((r) => ({ id: r.id, title: r.title || "Untitled" }));
        }
      }
    }
  }

  return (
    <AppShell userLabel={userEmail} recents={recents}>
      {children}
    </AppShell>
  );
}
