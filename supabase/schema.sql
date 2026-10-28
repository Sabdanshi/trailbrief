-- Run once in Supabase: SQL Editor -> New query -> paste -> Run.

create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  trek_id text not null,
  trek_date date not null,
  points jsonb not null default '{}'::jsonb,
  wildlife text[] not null default '{}',
  tip text check (char_length(tip) <= 280),
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

alter table reports enable row level security;
alter table feedback enable row level security;

-- Anyone can read trekker reports and add one; nobody can edit or delete through the app.
create policy "read reports" on reports for select using (true);
create policy "add report" on reports for insert with check (true);
-- Feedback can be added but only read from the Supabase dashboard.
create policy "add feedback" on feedback for insert with check (true);
