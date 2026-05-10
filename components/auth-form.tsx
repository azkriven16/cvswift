"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, UserRound } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function AuthForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setStatus("error");
        setMessage(error.message);
        return;
      }

      setStatus("sent");
      setMessage("Check your email for a magic link.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Could not send magic link.");
    }
  }

  async function continueAsGuest() {
    setStatus("loading");
    setMessage("");

    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error } = await supabase.auth.signInAnonymously();

      if (error) {
        setStatus("error");
        setMessage(`${error.message}. Enable Anonymous sign-ins in Supabase Auth settings.`);
        return;
      }

      if (!data.user) {
        setStatus("error");
        setMessage("Supabase did not return a guest session. Check Anonymous sign-ins in Auth settings.");
        return;
      }

      router.push("/app/resumes/new");
      router.refresh();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Could not start guest session.");
    }
  }

  return (
    <form className="auth-card" onSubmit={onSubmit}>
      <div>
        <p className="eyebrow">Free auth</p>
        <h1>Continue without email verification.</h1>
        <p className="hero-lede">Use a guest account to save resumes and run free AI audits with user and IP limits.</p>
      </div>
      <button className="button button-primary button-large" disabled={status === "loading"} type="button" onClick={continueAsGuest}>
        <UserRound size={17} />
        {status === "loading" ? "Starting..." : "Continue as guest"}
      </button>
      <div className="auth-divider"><span>Optional magic link</span></div>
      <label>
        Email
        <span>
          <Mail size={17} />
          <input
            required
            type="email"
            value={email}
            placeholder="you@example.com"
            onChange={(event) => setEmail(event.target.value)}
          />
        </span>
      </label>
      <button className="button button-secondary button-large" disabled={status === "loading"} type="submit">
        {status === "loading" ? "Sending..." : "Send magic link"}
      </button>
      {message && <p className={status === "error" ? "form-message form-error" : "form-message"}>{message}</p>}
    </form>
  );
}
