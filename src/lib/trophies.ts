// Canonical trophy definitions + the criteria engine. The Trophy Cabinet
// renders from this list and badges are stored by stable `id` (not display
// name), so copy tweaks never strand an earned trophy.
import type { State } from "../state/types";

export interface Trophy {
  id: string;
  name: string;
  icon: string;
  color: string;
  how: string;
}

export const TROPHIES: Trophy[] = [
  {
    id: "first_pass",
    name: "First Pass",
    icon: "check",
    color: "var(--green)",
    how: "Pass your very first quest. Complete any quest before its deadline to unlock this.",
  },
  {
    id: "first_step",
    name: "First Step",
    icon: "checkSquare",
    color: "var(--green)",
    how: "Tick off your first task. Break a quest into steps and finish one.",
  },
  {
    id: "strategist",
    name: "Strategist",
    icon: "pencil",
    color: "var(--sky)",
    how: "Add your first task. Big quests get done by splitting them into small steps.",
  },
  {
    id: "freelancer",
    name: "Freelancer",
    icon: "feather",
    color: "var(--ink)",
    how: "Create a standalone task — one that isn't tied to any quest.",
  },
  {
    id: "steps_10",
    name: "10 Steps",
    icon: "checkSquare",
    color: "var(--accent)",
    how: "Complete 10 tasks in total. Momentum is built one step at a time.",
  },
  {
    id: "steps_25",
    name: "25 Steps",
    icon: "checkSquare",
    color: "var(--sky)",
    how: "Complete 25 tasks in total. You're making this a habit.",
  },
  {
    id: "steps_50",
    name: "50 Steps",
    icon: "list",
    color: "var(--purple)",
    how: "Complete 50 tasks in total. Serious follow-through.",
  },
  {
    id: "steps_100",
    name: "100 Steps",
    icon: "list",
    color: "var(--gold)",
    how: "Complete 100 tasks in total. A century of small wins.",
  },
  {
    id: "quest_board",
    name: "Quest Board",
    icon: "target",
    color: "var(--accent)",
    how: "Have 5 quests on the go at once. A full board of commitments.",
  },
  {
    id: "quest_master",
    name: "Quest Master",
    icon: "target",
    color: "var(--magenta)",
    how: "Have 10 quests on the go at once. You're not short on ambition.",
  },
  {
    id: "side_hustler",
    name: "Side Hustler",
    icon: "feather",
    color: "var(--teal)",
    how: "Create a Side quest — a no-stake goal you take on just because.",
  },
  {
    id: "pass_monthly",
    name: "Monthly Win",
    icon: "shield",
    color: "var(--purple)",
    how: "Pass a Monthly quest. The medium-haul commitments count double.",
  },
  {
    id: "pass_quarterly",
    name: "Quarter Boss",
    icon: "trophy",
    color: "var(--magenta)",
    how: "Pass a Quarterly quest. The big bosses don't fall easily.",
  },
  {
    id: "pass_side",
    name: "Side Win",
    icon: "feather",
    color: "var(--teal)",
    how: "Pass a Side quest. Extra credit, claimed.",
  },
  {
    id: "high_roller",
    name: "High Roller",
    icon: "bolt",
    color: "var(--gold)",
    how: "Pass a quest with a stake of $150 or more. Big risk, bigger discipline.",
  },
  {
    id: "comeback",
    name: "Comeback",
    icon: "bolt",
    color: "var(--green)",
    how: "Fail a quest, then pass another. Falling down isn't failing — staying down is.",
  },
  {
    id: "streak_2",
    name: "2-Week",
    icon: "flame",
    color: "var(--accent)",
    how: "Keep your streak alive for 2 weeks straight. The hardest part is starting.",
  },
  {
    id: "streak_4",
    name: "4-Week",
    icon: "flame",
    color: "var(--accent)",
    how: "Keep your streak alive for 4 weeks straight — every weekly quest passed, no fails.",
  },
  {
    id: "streak_8",
    name: "8-Week",
    icon: "star",
    color: "var(--magenta)",
    how: "Hold an unbroken streak for 8 weeks. Double the 4-Week challenge.",
  },
  {
    id: "streak_12",
    name: "Quarter Streak",
    icon: "flame",
    color: "var(--magenta)",
    how: "Hold an unbroken streak for 12 weeks — a full quarter of discipline.",
  },
  {
    id: "streak_26",
    name: "Half-Year",
    icon: "star",
    color: "var(--purple)",
    how: "Hold an unbroken streak for 26 weeks. Half a year, no slip-ups.",
  },
  {
    id: "streak_52",
    name: "Full Year",
    icon: "crown",
    color: "var(--gold)",
    how: "Hold an unbroken streak for 52 weeks. A whole year of keeping the pact.",
  },
  {
    id: "skips_1",
    name: "First Skip",
    icon: "shield",
    color: "var(--sky)",
    how: "Resist one temptation. Add an item to your want list and let the timer run out.",
  },
  {
    id: "skips_5",
    name: "5 Skips",
    icon: "shield",
    color: "var(--sky)",
    how: "Resist temptation 5 times. Add an item to your want list and let the timer run out instead of buying it.",
  },
  {
    id: "skips_10",
    name: "10 Skips",
    icon: "shield",
    color: "var(--teal)",
    how: "Resist temptation 10 times. Your impulse-control muscle is growing.",
  },
  {
    id: "skips_25",
    name: "25 Skips",
    icon: "lock",
    color: "var(--teal)",
    how: "Resist temptation 25 times. Most urges really do just fade.",
  },
  {
    id: "skips_50",
    name: "50 Skips",
    icon: "lock",
    color: "var(--purple)",
    how: "Resist temptation 50 times. You've saved a small fortune in impulse buys.",
  },
  {
    id: "skips_100",
    name: "100 Skips",
    icon: "lock",
    color: "var(--gold)",
    how: "Resist temptation 100 times. Iron will, certified.",
  },
  {
    id: "window_shopper",
    name: "Window Shopper",
    icon: "heart",
    color: "var(--magenta)",
    how: "Add your first item to the want list instead of buying it on the spot.",
  },
  {
    id: "honest_buyer",
    name: "Honest Buyer",
    icon: "receipt",
    color: "var(--gold)",
    how: "Decide to buy something from your want list. Owning a choice counts too.",
  },
  {
    id: "clean_week",
    name: "Clean",
    icon: "sparkle",
    color: "var(--teal)",
    how: "Finish a full week (a streak) with zero unplanned spending logged that week.",
  },
  {
    id: "planner",
    name: "Planner",
    icon: "download",
    color: "var(--sky)",
    how: "Stash a future quest for later. Good plans wait their turn.",
  },
  {
    id: "deep_backlog",
    name: "Deep Backlog",
    icon: "download",
    color: "var(--purple)",
    how: "Stash 5 future quests. Never short of a next move.",
  },
  {
    id: "square_up",
    name: "Square Up",
    icon: "receipt",
    color: "var(--accent)",
    how: "Log your first payment to the anti-charity. Honor the consequences.",
  },
  {
    id: "reliable",
    name: "Reliable",
    icon: "receipt",
    color: "var(--teal)",
    how: "Log 5 payments. You always settle up.",
  },
  {
    id: "all_settled",
    name: "All Settled",
    icon: "handshake",
    color: "var(--green)",
    how: "Log 10 payments. The pact is sacred, debts and all.",
  },
  {
    id: "save_50",
    name: "$50",
    icon: "coin",
    color: "var(--gold)",
    how: "Save $50 from the anti-charity by passing quests.",
  },
  {
    id: "save_100",
    name: "$100",
    icon: "coin",
    color: "var(--gold)",
    how: "Save $100 from the anti-charity. Three digits and climbing.",
  },
  {
    id: "save_200",
    name: "$200",
    icon: "coin",
    color: "var(--gold)",
    how: "Save $200 from the anti-charity by passing quests and staying disciplined.",
  },
  {
    id: "save_500",
    name: "$500",
    icon: "trophy",
    color: "var(--purple)",
    how: "Reach $500 in total savings. The big one — discipline pays off.",
  },
  {
    id: "save_1000",
    name: "$1K",
    icon: "trophy",
    color: "var(--purple)",
    how: "Reach $1,000 in total savings. Four figures of willpower.",
  },
  {
    id: "save_2500",
    name: "$2.5K",
    icon: "trophy",
    color: "var(--magenta)",
    how: "Reach $2,500 in total savings. This is real money now.",
  },
  {
    id: "save_5000",
    name: "$5K",
    icon: "crown",
    color: "var(--gold)",
    how: "Reach $5,000 in total savings. The anti-charity goes hungry.",
  },
  {
    id: "mastery",
    name: "Mastery",
    icon: "crown",
    color: "var(--gold)",
    how: "Earn every other trophy in the cabinet to claim ultimate Mastery.",
  },
];

type Snapshot = Pick<
  State,
  | "streak"
  | "saved"
  | "urgesSkipped"
  | "wants"
  | "goals"
  | "futureGoals"
  | "spending"
  | "currentWeek"
  | "tasks"
  | "payments"
>;

// Returns the ids of every trophy whose criteria the snapshot currently
// satisfies. Pure — the caller diffs this against earned badges and persists
// any newly-met ids. Heuristic where the data model has no history (first
// pass / clean week); badges are append-only so a met trophy stays earned.
export function evaluateTrophies(s: Snapshot): string[] {
  const skipTotal =
    s.urgesSkipped + s.wants.filter((w) => w.decision === "skip").length;
  const weekSpent = s.spending
    .filter((x) => x.weekStart === s.currentWeek)
    .reduce((a, b) => a + b.amount, 0);
  const passed = s.goals.filter((g) => g.status === "Pass");
  const tasksDone = s.tasks.filter((t) => t.done).length;

  const base: Record<string, boolean> = {
    first_pass: s.saved > 0 || passed.length > 0,
    first_step: tasksDone >= 1,
    strategist: s.tasks.length >= 1,
    freelancer: s.tasks.some((t) => !t.goalId),
    steps_10: tasksDone >= 10,
    steps_25: tasksDone >= 25,
    steps_50: tasksDone >= 50,
    steps_100: tasksDone >= 100,
    quest_board: s.goals.length >= 5,
    quest_master: s.goals.length >= 10,
    side_hustler: s.goals.some((g) => g.category === "Side"),
    pass_monthly: passed.some((g) => g.category === "Monthly"),
    pass_quarterly: passed.some((g) => g.category === "Quarterly"),
    pass_side: passed.some((g) => g.category === "Side"),
    high_roller: passed.some((g) => Number(g.stake) >= 150),
    comeback: passed.length > 0 && s.goals.some((g) => g.status === "Fail"),
    streak_2: s.streak >= 2,
    streak_4: s.streak >= 4,
    streak_8: s.streak >= 8,
    streak_12: s.streak >= 12,
    streak_26: s.streak >= 26,
    streak_52: s.streak >= 52,
    skips_1: skipTotal >= 1,
    skips_5: skipTotal >= 5,
    skips_10: skipTotal >= 10,
    skips_25: skipTotal >= 25,
    skips_50: skipTotal >= 50,
    skips_100: skipTotal >= 100,
    window_shopper: s.wants.length >= 1,
    honest_buyer: s.wants.some((w) => w.decision === "buy"),
    clean_week: s.streak >= 1 && weekSpent === 0,
    planner: s.futureGoals.length >= 1,
    deep_backlog: s.futureGoals.length >= 5,
    square_up: s.payments.length >= 1,
    reliable: s.payments.length >= 5,
    all_settled: s.payments.length >= 10,
    save_50: s.saved >= 50,
    save_100: s.saved >= 100,
    save_200: s.saved >= 200,
    save_500: s.saved >= 500,
    save_1000: s.saved >= 1000,
    save_2500: s.saved >= 2500,
    save_5000: s.saved >= 5000,
  };

  const met = Object.keys(base).filter((id) => base[id]);
  const others = TROPHIES.map((t) => t.id).filter((id) => id !== "mastery");
  if (others.every((id) => met.includes(id))) met.push("mastery");
  return met;
}
