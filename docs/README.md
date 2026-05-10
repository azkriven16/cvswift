# CVSwift Specs

This folder is the source of truth for product, architecture, and free-tier decisions as we build CVSwift.

## Current Direction

CVSwift is a free, open-source resume builder and auditor that can also be hosted online as a portfolio project.

The hosted demo should use real services, not mocks, while staying inside free tiers:

- Vercel Free for hosting
- Supabase Free for auth, database, and limited file storage
- OpenRouter free models for AI audits, with strict server-side limits
- PostHog Free is optional for analytics/error tracking

## Specs

- [Product Brief](./product-brief.md)
- [Free-Tier Architecture](./free-tier-architecture.md)
- [Supabase Data Model](./supabase-data-model.md)
- [Storage Guidelines](./storage-guidelines.md)
- [AI And Rate Limits](./ai-and-rate-limits.md)
- [Open Source Guidelines](./open-source-guidelines.md)
- [Roadmap](./roadmap.md)
- [Todo And Product Guardrails](./todo.md)
