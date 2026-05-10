# Roadmap

## Phase 1: Docs And Direction

- Document product direction.
- Document free-tier limits.
- Document Supabase schema.
- Document storage and AI guardrails.

## Phase 2: Real Supabase Foundation

- Add Supabase server/client helpers. Done.
- Add auth UI. Done.
- Create SQL schema. Done in `supabase/schema.sql`.
- Add RLS policies. Done in `supabase/schema.sql`.
- Replace app dashboard with real `resumes` queries. Done.
- Enforce 5-resume limit on server. Done in `POST /api/resumes`.

## Phase 3: Resume Builder MVP

- Resume dashboard. Done.
- Create resume. Done.
- Edit/delete resume.
- Store resume content as JSONB. Done for create.
- Basic resume preview. Done.
- JSON export/import. Done in the builder.
- PDF export generated on demand.

## Phase 4: Free AI Audits

- Add OpenRouter provider. Done.
- Auth-required audit route. Done in `POST /api/audits`.
- Enforce 2 audits/day. Done.
- Save audit history. Done.
- Display audit results in the app.

## Phase 5: Storage Uploads

- Add private `resume_uploads` bucket. Done in `supabase/schema.sql`.
- Enforce 3 uploads/user and 2 MB/file. Done in `POST /api/uploads`.
- Allow PDF/DOCX/TXT source uploads. Done.
- Track uploads in `uploads`. Done.

## Phase 6: Open Source Polish

- README.
- LICENSE.
- CONTRIBUTING.
- Self-hosting docs.
- Vercel deploy guide.
- Supabase setup guide.

## Phase 7: Optional Monetization Later

- Stripe checkout.
- $5/month Pro.
- Higher limits.
- Managed AI rewrites.
- Job-description tailoring.
