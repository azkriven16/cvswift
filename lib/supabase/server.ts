import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabasePublishableKey, hasSupabaseEnv } from "@/lib/env";
import type { Database } from "@/lib/supabase/types";

export async function createSupabaseServerClient() {
  if (!hasSupabaseEnv()) return null;

  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    getSupabasePublishableKey(),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            try {
              cookieStore.set(name, value, options);
            } catch {
              // Server Components can read cookies but cannot refresh them.
              // Middleware handles Supabase session refreshes for normal requests.
            }
          });
        },
      },
    }
  );
}

export async function requireUser() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return {
      supabase: null,
      user: null,
      setupMissing: ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"],
    };
  }

  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    return { supabase, user: null, setupMissing: [] };
  }

  return { supabase, user: data.user, setupMissing: [] };
}
