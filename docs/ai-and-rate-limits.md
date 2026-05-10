# AI And Rate Limits

## AI Provider

Use OpenRouter first.

Reasons:

- One API for multiple models
- Free model options
- Easy to swap models
- Self-hosters can bring their own key

## Free-Only Rule

The hosted version should only call free models until we intentionally add paid billing.

Do not add automatic fallback to paid models.

## Hosted Limits

Free hosted users:

- 2 AI audits per day
- 2 AI audits per day per IP hash

Future Pro users:

- Higher audit limits
- AI rewrites
- Job-description tailoring

## Server-Side Audit Flow

`POST /api/audits`

1. Get authenticated Supabase user. Anonymous guest users are allowed.
2. Read user profile and plan.
3. Hash the request IP and count today's `rate_limit_events`.
4. Count today's `ai_usage_events` for `kind = 'resume_audit'`.
5. If free user or IP has used 2 audits, return `429`.
6. Call OpenRouter free model.
7. Save audit result in `resume_audits`.
8. Insert `ai_usage_events` and `rate_limit_events` rows.
9. Return audit result.

## Prompt Shape

The audit should return structured JSON:

```json
{
  "score": 86,
  "summary": "Strong frontend signal, but add measurable impact.",
  "categories": [
    {
      "label": "Impact",
      "score": 82,
      "note": "Add metrics to two bullets."
    }
  ],
  "suggestions": [
    "Rewrite the summary for Senior Frontend Engineer roles."
  ]
}
```

## Abuse Protection

Minimum:

- Auth required for AI routes.
- Anonymous guest auth is allowed.
- User-level daily limits in Supabase.
- IP-hash daily limits in `rate_limit_events`.
- No unauthenticated AI calls.

Later:

- Add PostHog or logs for failed/limited attempts.
- Add Turnstile if abuse appears.
