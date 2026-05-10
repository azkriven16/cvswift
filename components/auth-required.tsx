import Link from "next/link";

export function AuthRequired() {
  return (
    <main className="auth-page">
      <section className="setup-card">
        <p className="eyebrow">Account required</p>
        <h1>Continue as guest first.</h1>
        <p>Resume editing, cloud saves, uploads, and AI audits require a free Supabase anonymous account.</p>
        <Link className="button button-primary" href="/login">
          Continue free
        </Link>
      </section>
    </main>
  );
}
