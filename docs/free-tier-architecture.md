# Free-Tier Architecture

## Goal

Host a real public portfolio app without paying for infrastructure.

## Recommended Stack

- Next.js App Router
- TypeScript
- pnpm
- Vercel Free
- Supabase Free
- OpenRouter free models
- PostHog Free, optional

## Free-Tier Guardrails

The app should fail closed rather than create surprise costs.

Rules:

- Do not enable paid Supabase add-ons.
- Do not store generated PDFs.
- Do not allow large uploads.
- Do not call paid AI models.
- Do not add automatic paid AI fallbacks.
- Enforce limits in server routes, not only the frontend.

## Supabase Free Fit

Supabase Free is enough for a portfolio demo if resume data stays mostly text.

Relevant limits we are designing around:

- 500 MB database
- 1 GB storage
- 50 MB max file size on Free projects
- 10 GB storage bandwidth/egress
- 50k monthly active users
- 2 free projects

Our app-level limits should be stricter than Supabase limits.

## Hosted User Limits

Free hosted users:

- 5 resumes
- 2 AI audits/day
- 2 AI audits/day per IP hash
- 3 uploaded source files
- 2 MB max per file

## Data Strategy

Store resume content in Postgres as JSON:

```txt
resumes.content jsonb
```

Use Supabase Storage only for optional source uploads:

```txt
resume_uploads/{user_id}/{file_id}
```

Generate PDFs on demand and download directly.

## Service Boundaries

Use adapter-style modules so the product can evolve:

```txt
lib/services/auth
lib/services/resumes
lib/services/audits
lib/services/storage
lib/services/ai
lib/services/analytics
```

The current code has mock-friendly service boundaries. Replace those with real Supabase/OpenRouter calls when env vars are ready.
The core app routes are now real and return setup/auth errors until env vars are configured.

## Auth Choice

Use Supabase anonymous auth as the primary free flow.

Dashboard setting:

- Authentication -> Sign In / Providers -> Anonymous sign-ins: enabled

Email magic links can stay optional, but the hosted portfolio MVP should not require email verification.

## Public Deploy Abuse Protection

Before deploying publicly, add Cloudflare Turnstile.

Use Turnstile for:

- Anonymous sign-in entry point
- AI audit route

Required env vars:

```txt
NEXT_PUBLIC_TURNSTILE_SITE_KEY
TURNSTILE_SECRET_KEY
```

Keep Turnstile optional in local development so the app remains easy to run.
