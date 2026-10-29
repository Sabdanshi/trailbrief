-- Run once in Supabase: SQL Editor -> New query -> paste -> Run.

create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  trek_id text not null,
  trek_date date not null,
  points jsonb not null default '{}'::jsonb,
  wildlife text[] not null default '{}',
  women_comfort int check (women_comfort between 1 and 5),
  tip text check (char_length(tip) <= 280),
  recommendation text check (char_length(recommendation) <= 200),
  name text check (char_length(name) <= 40),
  created_at timestamptz not null default now()
);

create table if not exists feedback (
  id uuid primary key default gen_random_uuid(),
  helpful int not null check (helpful between 1 and 5),
  stuck text check (char_length(stuck) <= 1000),
  change text check (char_length(change) <= 1000),
  name text check (char_length(name) <= 40),
  created_at timestamptz not null default now()
);

create table if not exists trek_requests (
  id uuid primary key default gen_random_uuid(),
  trek text not null check (char_length(trek) between 2 and 80),
  name text check (char_length(name) <= 40),
  created_at timestamptz not null default now()
);

-- Trail status: problems trekkers flag (added after launch; safe to re-run).
alter table reports add column if not exists issues text[] not null default '{}';
alter table reports add column if not exists issue_point text;
alter table reports add column if not exists issue_note text check (char_length(issue_note) <= 140);

alter table trek_requests enable row level security;
alter table reports enable row level security;
alter table feedback enable row level security;

-- Anyone can read trekker reports and add one; nobody can edit or delete through the app.
create policy "read reports" on reports for select using (true);
create policy "add report" on reports for insert with check (true);
-- Feedback can be added but only read from the Supabase dashboard.
create policy "add feedback" on feedback for insert with check (true);
create policy "add trek request" on trek_requests for insert with check (true);
