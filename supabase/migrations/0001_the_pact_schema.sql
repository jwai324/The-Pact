-- The Pact — shared, no-auth dataset. RLS enabled with permissive
-- anon/authenticated policies (open by design: app has no login per the
-- product owner's decision). Realtime enabled on every data table so edits
-- from either participant sync live.

create table public.app_state (
  id int primary key default 1,
  streak int not null default 0,
  saved numeric not null default 0,
  urges_skipped int not null default 0,
  weekly_budget numeric not null default 125,
  last_locked_stakes numeric not null default 0,
  badges jsonb not null default '[]'::jsonb,
  constraint app_state_singleton check (id = 1)
);

create table public.goals (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  stake numeric not null default 0,
  status text not null default 'Pending',
  relative text,
  paid boolean not null default false,
  sort int not null default 0,
  created_at timestamptz not null default now()
);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  goal_id uuid references public.goals(id) on delete cascade,
  title text not null,
  minutes int,
  done boolean not null default false,
  sort int not null default 0,
  created_at timestamptz not null default now()
);

create table public.wants (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  price numeric,
  added_at timestamptz,
  expires_at timestamptz,
  added_label text,
  date_label text,
  decision text,
  created_at timestamptz not null default now()
);

create table public.spending (
  id uuid primary key default gen_random_uuid(),
  amount numeric not null,
  note text,
  category text,
  week_start date,
  day_label text,
  created_at timestamptz not null default now()
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  amount numeric not null,
  date_label text,
  note text,
  proof_url text,
  created_at timestamptz not null default now()
);

create index tasks_goal_id_idx on public.tasks (goal_id);
create index goals_category_idx on public.goals (category);
create index spending_week_start_idx on public.spending (week_start);

alter table public.app_state enable row level security;
alter table public.goals enable row level security;
alter table public.tasks enable row level security;
alter table public.wants enable row level security;
alter table public.spending enable row level security;
alter table public.payments enable row level security;

create policy "open_all" on public.app_state for all to anon, authenticated using (true) with check (true);
create policy "open_all" on public.goals for all to anon, authenticated using (true) with check (true);
create policy "open_all" on public.tasks for all to anon, authenticated using (true) with check (true);
create policy "open_all" on public.wants for all to anon, authenticated using (true) with check (true);
create policy "open_all" on public.spending for all to anon, authenticated using (true) with check (true);
create policy "open_all" on public.payments for all to anon, authenticated using (true) with check (true);

alter table public.app_state replica identity full;
alter table public.goals replica identity full;
alter table public.tasks replica identity full;
alter table public.wants replica identity full;
alter table public.spending replica identity full;
alter table public.payments replica identity full;

alter publication supabase_realtime add table public.app_state;
alter publication supabase_realtime add table public.goals;
alter publication supabase_realtime add table public.tasks;
alter publication supabase_realtime add table public.wants;
alter publication supabase_realtime add table public.spending;
alter publication supabase_realtime add table public.payments;
