# Todo And Product Guardrails

## Completed

- [x] Expand NovoResume comparison into an actionable product roadmap.
- [x] Add Playwright smoke coverage for every current page route and API route.
- [x] Verify smoke suite locally: 11 Playwright tests passed on 2026-05-06.
- [x] Edit route for existing resumes (`/app/resumes/[id]`) — fully functional with audit history.
- [x] Deterministic PDF export via `/app/resumes/[id]/print` — print page with A4 CSS, one-page height warning.
- [x] Source upload UI — editor has upload button; source files now also saved to Supabase storage when `resumeId` is set.
- [x] Real PDF/DOCX parser — `pdf-parse` + `mammoth` in `/api/job-post/extract`.
- [x] Job post image OCR — tesseract.js + OpenRouter vision fallback.
- [x] Audit history displayed on resume detail pages.
- [x] Public read-only share links — `/r/[id]` page + Share button in editor.
- [x] Editor title/targetRole — now loaded from DB and editable in the UI; saves correctly.
- [x] Job post input + AI tailoring — textarea + file upload in the assistant panel; calls `/api/ai/tailor` (OpenRouter) which rewrites summary, bullets, and skills to match the job description.
- [x] Multi-experience and multi-education editing — all entries rendered; inline Add/Remove/Add-bullet buttons; per-entry contenteditable fields.
- [x] Public share page bug fix — now renders all experience and education entries.
- [x] Real resume list page at `/app/resumes` — live data from DB, links to edit, relative dates.
- [x] Live sidebar recents — layout fetches real resumes and passes to AppShell; links to actual resume IDs.
- [x] "Try sample data" button — loads a realistic resume + sample job post on the new-resume page.
- [x] Cover letter generation — `/api/ai/cover-letter` + UI panel in editor (requires job post + saved resume).
- [x] Audit keyword display — audit prompt now returns `detected_keywords` + `suggested_keywords`; shown as color-coded chips in audit history.

## Next Useful Work

- Add Cloudflare Turnstile before public launch (see Before Public Deploy section).

## Competitive Roadmap From NovoResume Review

Use this to beat generic resume builders by owning the AI job-post tailoring workflow first.

- [ ] Production-grade template system: keep a small set of high-quality designs, but make each one structurally different, print-safe, and obviously suited to a use case such as ATS, senior, compact one-page, tech, or profile/photo-ready.
- [ ] Section management: add, remove, reorder, and rename resume sections like Projects, Certifications, Awards, Volunteer Work, Education, Skills Groups, and Links.
- [ ] Job match audit: show matched keywords, missing keywords, weak bullets, repeated phrasing, measurable-impact gaps, and ATS formatting risks after the user adds a job post.
- [ ] Guided AI edit actions: add quick actions for selected text such as Rewrite selected bullet, Make more senior, Add metrics, Match job post, Shorten, and Improve ATS.
- [ ] Cover letter package: generate a matching cover letter, short recruiter message, LinkedIn outreach note, and application email from the same job/resume context.
- [ ] Better sample/onboarding states: add demo job post, demo resume, and a one-click sample flow so new users understand the product without bringing their own files first.
- [ ] Builder guidance layer: add inline coaching around section quality, bullet strength, missing details, and resume format choices without turning the UI into a tutorial.
- [ ] Export maturity: support PDF first, then DOCX later; include page-break handling, export preview, and clear warnings when a design is not ATS-safe.
- [ ] Trust and positioning: make the product story clear around “AI tailoring for this exact job post,” rather than competing as a generic template gallery.
- [ ] Matching design sets: eventually pair resume templates with cover letter templates and application-message formats.

## Testing Todo

- [ ] Add browser-rendered Playwright visual smoke tests after installing Chromium system dependencies such as `libnspr4` on the local/CI machine.
- [ ] Add authenticated Playwright coverage for the full resume intake flow once test auth/session setup is available.
- [ ] Add screenshot regression checks for each resume template at laptop and desktop widths.

## Before Public Deploy

- Rotate local/dev API keys that were exposed during development, including Supabase service role keys and OpenRouter keys.
- Add Cloudflare Turnstile to protect anonymous sign-ins and AI audit routes.
- Add env vars:
  - `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
  - `TURNSTILE_SECRET_KEY`
- Verify Turnstile token server-side before expensive/abusable actions.
- Keep CAPTCHA disabled or optional for local development.

## What Not To Do Yet

Avoid these until the free hosted MVP is genuinely useful:

- Pro tier
- Stripe
- Fancy template marketplace
- Profile photos
- Stored generated PDFs
- Too many templates
- Complex team/workspace features

Reason: these add cost, scope, and operational risk before the core resume builder, audits, and free hosting story are proven.
