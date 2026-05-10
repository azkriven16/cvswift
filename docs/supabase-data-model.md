# Supabase Data Model

## Tables

### profiles

One row per authenticated user.

```sql
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  plan text not null default 'free',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

### resumes

Resume content is stored as JSON for MVP simplicity.

```sql
create table resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  target_role text,
  template_id text not null default 'default',
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

### resume_audits

Stores audit result history.

```sql
create table resume_audits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  resume_id uuid not null references resumes(id) on delete cascade,
  score int not null,
  result jsonb not null,
  created_at timestamptz not null default now()
);
```

### ai_usage_events

Used for daily limits.

```sql
create table ai_usage_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null,
  provider text not null default 'openrouter',
  created_at timestamptz not null default now()
);
```

### rate_limit_events

Used for IP-hash limits. This table should be accessed only with the server-side service role.

```sql
create table rate_limit_events (
  id uuid primary key default gen_random_uuid(),
  ip_hash text not null,
  user_id uuid references auth.users(id) on delete set null,
  kind text not null,
  created_at timestamptz not null default now()
);
```

### uploads

Tracks optional uploaded source files.

```sql
create table uploads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  resume_id uuid references resumes(id) on delete set null,
  bucket text not null default 'resume_uploads',
  path text not null,
  mime_type text not null,
  size_bytes int not null,
  created_at timestamptz not null default now()
);
```

## RLS Rules

Enable RLS on all app tables.

Every user can only access their own rows:

```sql
user_id = auth.uid()
```

For `profiles`:

```sql
id = auth.uid()
```

## Limit Enforcement

Limits should be enforced in server routes:

- Resume creation checks current resume count.
- Audit creation checks today's `ai_usage_events`.
- Upload creation checks upload count and file size.

RLS protects ownership. Server routes protect product limits.

`rate_limit_events` has RLS enabled with no public policies. Server routes use `SUPABASE_SERVICE_ROLE_KEY` to query and insert IP-hash events.
