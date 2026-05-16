-- One-time seed of the prototype's demo data (run once, after 0001).
-- Tasks join to goals by title (titles are unique in the seed set).

insert into public.app_state (id, streak, saved, urges_skipped, weekly_budget, last_locked_stakes, badges)
values (1, 6, 450, 17, 125, 100,
  '["First Pass","4-Week Streak","5 Urges Skipped","$200 Saved","Clean Week"]'::jsonb);

with g as (
  insert into public.goals (title, category, stake, status, relative, paid, sort) values
    ('Spend only $65 (needed) + $20 (fun) this week','Weekly',50,'Pass','passed Tue',false,1),
    ('Set up 2-account system (Bills + Spending)','Weekly',50,'Pass','passed today',false,2),
    ('Set up Auto 401(k) contributions','Monthly',100,'Pending',null,false,3),
    ('Set up Auto IRA contributions','Monthly',100,'Pending',null,false,4),
    ('Achieve balanced budget after contributions','Monthly',100,'Fail','missed last week',false,5),
    ('Prove Jen wrong','Quarterly',150,'Pending',null,false,6),
    ('Find a job with more joy and money','Quarterly',150,'Pending',null,false,7),
    ('Re-read Your Money or Your Life','Side',0,'Pending',null,false,8),
    ('Plant the herb garden Justin keeps mentioning','Side',0,'Pending',null,false,9),
    ('Drop 3 things from the closet at Goodwill','Side',0,'Pass','passed Sun',false,10)
  returning id, title
)
insert into public.tasks (goal_id, title, minutes, done, sort)
select g.id, t.title, t.minutes, t.done, t.sort
from g
join (values
  ('Set up Auto 401(k) contributions','Log into Fidelity, find current contribution %',5,true,1),
  ('Set up Auto 401(k) contributions','Bump contribution to 6% (employer match)',5,true,2),
  ('Set up Auto 401(k) contributions','Set auto-escalator +1% every Jan',10,false,3),
  ('Set up Auto IRA contributions','Open Roth IRA at Fidelity',15,false,4),
  ('Set up Auto IRA contributions','Set $200/mo auto-contribution from Bills account',5,false,5),
  ('Find a job with more joy and money','Update resume — clinical leadership section',15,true,6),
  ('Find a job with more joy and money','Ask Carla for a referral to peds clinic',10,false,7),
  ('Find a job with more joy and money','Apply to 2 day-shift roles',15,false,8),
  ('Re-read Your Money or Your Life','Find the copy in the basement box',10,true,9),
  ('Re-read Your Money or Your Life','Read chapters 1–3 with morning coffee',15,false,10),
  ('Re-read Your Money or Your Life','Make a one-page note of the wake-up moments',15,false,11),
  ('Plant the herb garden Justin keeps mentioning','Pick up basil + rosemary starters at Home Depot',15,false,12),
  ('Plant the herb garden Justin keeps mentioning','Plant on the west window box',15,false,13)
) as t(parent,title,minutes,done,sort) on t.parent = g.title;

insert into public.wants (title, price, added_at, expires_at, added_label, date_label, decision, created_at) values
  ('Linen throw blanket', 89, now() - interval '21 hours', now() + interval '3 hours 22 minutes', 'yesterday 2am', null, null, now()),
  ('Replacement scrub set', 64, now() - interval '8 hours', now() + interval '16 hours', 'this morning', null, null, now() - interval '1 second'),
  ('Amazon impulse cart ($112)', 112, now() - interval '26 hours', now() - interval '2 hours', 'yesterday 11pm', null, null, now() - interval '2 seconds'),
  ('Skincare bundle', 78, null, null, null, 'Apr 28', 'skip', now() - interval '3 seconds'),
  ('New work shoes', 45, null, null, null, 'Apr 25', 'buy', now() - interval '4 seconds'),
  ('Etsy candle set', 32, null, null, null, 'Apr 22', 'skip', now() - interval '5 seconds');

insert into public.spending (amount, note, category, week_start, day_label, created_at) values
  (28.99, 'Etsy print', 'Online', date_trunc('week', now())::date, 'Mon', now()),
  (18.50, 'Lunch out', 'Dining', date_trunc('week', now())::date, 'Tue', now() - interval '1 second'),
  (34.00, 'Sephora sample', 'Beauty', date_trunc('week', now())::date, 'Wed', now() - interval '2 seconds'),
  (12.40, 'Yarn for Linda''s hat', 'Hobbies', date_trunc('week', now())::date, 'Thu', now() - interval '3 seconds');

insert into public.payments (amount, date_label, note, proof_url, created_at) values
  (100, 'Apr 14, 2026', 'Missed monthly: balanced budget', 'act.donate/abc', now()),
  (50, 'Mar 23, 2026', 'Missed weekly budget', null, now() - interval '1 second');
