create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  plan text not null default 'free' check (plan in ('free', 'pro')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  target_role text,
  template_id text not null default 'default',
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.resume_audits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  resume_id uuid not null references public.resumes(id) on delete cascade,
  score int not null check (score >= 0 and score <= 100),
  result jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists public.ai_usage_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null,
  provider text not null default 'openrouter',
  created_at timestamptz not null default now()
);

create table if not exists public.uploads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  resume_id uuid references public.resumes(id) on delete set null,
  bucket text not null default 'resume_uploads',
  path text not null,
  mime_type text not null,
  size_bytes int not null check (size_bytes <= 2097152),
  created_at timestamptz not null default now()
);

create table if not exists public.rate_limit_events (
  id uuid primary key default gen_random_uuid(),
  ip_hash text not null,
  user_id uuid references auth.users(id) on delete set null,
  kind text not null,
  created_at timestamptz not null default now()
);

create index if not exists rate_limit_events_ip_kind_created_idx
  on public.rate_limit_events (ip_hash, kind, created_at desc);

alter table public.profiles enable row level security;
alter table public.resumes enable row level security;
alter table public.resume_audits enable row level security;
alter table public.ai_usage_events enable row level security;
alter table public.uploads enable row level security;
alter table public.rate_limit_events enable row level security;

drop policy if exists "Users read own profile" on public.profiles;
create policy "Users read own profile" on public.profiles
  for select using (id = auth.uid());

drop policy if exists "Users update own profile" on public.profiles;
create policy "Users update own profile" on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists "Users insert own profile" on public.profiles;
create policy "Users insert own profile" on public.profiles
  for insert with check (id = auth.uid());

drop policy if exists "Users read own resumes" on public.resumes;
create policy "Users read own resumes" on public.resumes
  for select using (user_id = auth.uid());

drop policy if exists "Users insert own resumes" on public.resumes;
create policy "Users insert own resumes" on public.resumes
  for insert with check (user_id = auth.uid());

drop policy if exists "Users update own resumes" on public.resumes;
create policy "Users update own resumes" on public.resumes
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "Users delete own resumes" on public.resumes;
create policy "Users delete own resumes" on public.resumes
  for delete using (user_id = auth.uid());

drop policy if exists "Users read own audits" on public.resume_audits;
create policy "Users read own audits" on public.resume_audits
  for select using (user_id = auth.uid());

drop policy if exists "Users insert own audits" on public.resume_audits;
create policy "Users insert own audits" on public.resume_audits
  for insert with check (user_id = auth.uid());

drop policy if exists "Users read own usage events" on public.ai_usage_events;
create policy "Users read own usage events" on public.ai_usage_events
  for select using (user_id = auth.uid());

drop policy if exists "Users insert own usage events" on public.ai_usage_events;
create policy "Users insert own usage events" on public.ai_usage_events
  for insert with check (user_id = auth.uid());

drop policy if exists "Users read own uploads" on public.uploads;
create policy "Users read own uploads" on public.uploads
  for select using (user_id = auth.uid());

drop policy if exists "Users insert own uploads" on public.uploads;
create policy "Users insert own uploads" on public.uploads
  for insert with check (user_id = auth.uid());

drop policy if exists "Users delete own uploads" on public.uploads;
create policy "Users delete own uploads" on public.uploads
  for delete using (user_id = auth.uid());

-- No public RLS policies for rate_limit_events.
-- Server routes write/read this table with SUPABASE_SERVICE_ROLE_KEY only.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do update set email = excluded.email;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'resume_uploads',
  'resume_uploads',
  false,
  2097152,
  array[
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Users manage own resume uploads" on storage.objects;
create policy "Users manage own resume uploads" on storage.objects
  for all
  using (
    bucket_id = 'resume_uploads'
    and owner = auth.uid()
  )
  with check (
    bucket_id = 'resume_uploads'
    and owner = auth.uid()
  );
