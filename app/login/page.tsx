import type { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
import { hasSupabaseEnv } from "@/lib/env";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  if (!hasSupabaseEnv()) {
    return (
      <main className="auth-page">
        <section className="setup-card">
          <p className="eyebrow">Setup required</p>
          <h1>Add Supabase env vars.</h1>
          <p>
            Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code> to
            <code>.env.local</code>, then restart the dev server.
          </p>
          <Link className="button button-secondary" href="/">
            Back home
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="auth-page">
      <AuthForm />
    </main>
  );
}
