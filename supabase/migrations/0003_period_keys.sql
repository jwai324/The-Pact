-- Period-rollover bookkeeping for client-side auto-fail of overdue quests.
-- The app has no backend cron, so on each open it compares the current
-- week/month/quarter to the last one it reconciled and fails any quest left
-- Pending past its period end. These columns store that "last reconciled"
-- period per cadence. They are nullable on purpose: a null means "never
-- reconciled", which the first sweep initializes WITHOUT failing anything,
-- so an existing/seeded dataset is not retro-failed.
alter table public.app_state
  add column if not exists last_week_key text,
  add column if not exists last_month_key text,
  add column if not exists last_quarter_key text;
