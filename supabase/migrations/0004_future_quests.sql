-- Future Quests: a hidden stash of parked quests. They live in the same
-- goals table but are flagged so they never appear in active lists and are
-- never auto-failed by the period-rollover sweep — until the user pushes
-- one into a real spot (which just flips this flag back off). Default false
-- so every existing quest stays active and unaffected.
alter table public.goals
  add column if not exists future boolean not null default false;
