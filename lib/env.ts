export function getEnv(name: string) {
  return process.env[name]?.trim() || "";
}

export function hasSupabaseEnv() {
  return Boolean(getEnv("NEXT_PUBLIC_SUPABASE_URL") && getSupabasePublishableKey());
}

export function hasSupabaseAdminEnv() {
  return Boolean(hasSupabaseEnv() && getEnv("SUPABASE_SERVICE_ROLE_KEY"));
}

export function getSupabasePublishableKey() {
  return getEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY") || getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

export function hasOpenRouterEnv() {
  return Boolean(getEnv("OPENROUTER_API_KEY"));
}

export function getAppUrl() {
  return getEnv("NEXT_PUBLIC_APP_URL") || "http://localhost:3002";
}

export function getRequestOrigin(request: Request) {
  return new URL(request.url).origin;
}

export function getSafeRedirectUrl(path: string, origin: string) {
  return new URL(path.startsWith("/") && !path.startsWith("//") ? path : "/app/resumes/new", origin);
}

export function setupError(missing: string[]) {
  return {
    error: "Setup required",
    missing,
    message: `Add ${missing.join(", ")} to .env.local and restart the dev server.`,
  };
}
