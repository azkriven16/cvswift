# Open Source Guidelines

## Philosophy

CVSwift should be useful as an open-source project and impressive as a hosted portfolio demo.

## License

Use MIT unless we decide otherwise.

## Self-Hosting

Self-hosters should be able to provide:

- Supabase project
- OpenRouter key
- Vercel or any Node-compatible host

They should not need our hosted accounts or paid services.

## Environment Variables

Keep `.env.example` updated.

Required for real hosted flows:

```txt
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

Optional:

```txt
OPENROUTER_API_KEY
OPENROUTER_MODEL
NEXT_PUBLIC_POSTHOG_KEY
NEXT_PUBLIC_POSTHOG_HOST
RESEND_API_KEY
```

Future paid features:

```txt
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
NEXT_PUBLIC_STRIPE_PRO_PRICE_ID
```

## Repo Expectations

Before public release, add:

- README.md
- LICENSE
- CONTRIBUTING.md
- docs/self-hosting.md
- supabase/schema.sql
- screenshot or demo GIF

## Product Honesty

Do not advertise unlimited hosted AI if the app uses free models.

Use language like:

```txt
Free hosted demo with fair-use limits.
Self-host with your own keys.
```
