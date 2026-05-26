-- Three spending buckets: Necessities (food, shelter), Semi-necessities
-- (home repair, work supplies), and Discretionary (movies, fun). Each gets
-- its own weekly cap so over-spending in one bucket can't quietly eat the
-- others. Defaults sum to $200/wk (100 / 50 / 50). The legacy
-- `weekly_budget` column is kept for backward compat but is no longer read
-- by the app.
alter table public.app_state
  add column if not exists necessities_budget numeric not null default 100,
  add column if not exists semi_necessities_budget numeric not null default 50,
  add column if not exists discretionary_budget numeric not null default 50;
