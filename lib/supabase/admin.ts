import { createClient } from "@supabase/supabase-js";
import { getEnv, hasSupabaseAdminEnv } from "@/lib/env";
import type { Database } from "@/lib/supabase/types";

export function createSupabaseAdminClient() {
  if (!hasSupabaseAdminEnv()) return null;

  return createClient<Database>(
    getEnv("NEXT_PUBLIC_SUPABASE_URL"),
    getEnv("SUPABASE_SERVICE_ROLE_KEY"),
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
