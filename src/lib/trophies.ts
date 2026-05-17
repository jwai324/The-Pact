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
    id: "streak_4",
    name: "4-Week",
    icon: "flame",
    color: "var(--accent)",
    how: "Keep your streak alive for 4 weeks straight — every weekly quest passed, no fails.",
  },
  {
    id: "skips_5",
    name: "5 Skips",
    icon: "shield",
    color: "var(--sky)",
    how: "Resist temptation 5 times. Add an item to your want list and let the timer run out instead of buying it.",
  },
  {
    id: "save_200",
    name: "$200",
    icon: "coin",
    color: "var(--gold)",
    how: "Save $200 from the anti-charity by passing quests and staying disciplined.",
  },
  {
    id: "clean_week",
    name: "Clean",
    icon: "sparkle",
    color: "var(--teal)",
    how: "Finish a full week (a streak) with zero unplanned spending logged that week.",
  },
  {
    id: "streak_8",
    name: "8-Week",
    icon: "star",
    color: "var(--magenta)",
    how: "Hold an unbroken streak for 8 weeks. Double the 4-Week challenge.",
  },
  {
    id: "save_500",
    name: "$500",
    icon: "trophy",
    color: "var(--purple)",
    how: "Reach $500 in total savings. The big one — discipline pays off.",
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
  "streak" | "saved" | "urgesSkipped" | "wants" | "goals" | "spending" | "currentWeek"
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

  const base: Record<string, boolean> = {
    first_pass: s.saved > 0 || s.goals.some((g) => g.status === "Pass"),
    streak_4: s.streak >= 4,
    skips_5: skipTotal >= 5,
    save_200: s.saved >= 200,
    clean_week: s.streak >= 1 && weekSpent === 0,
    streak_8: s.streak >= 8,
    save_500: s.saved >= 500,
  };

  const met = Object.keys(base).filter((id) => base[id]);
  const others = TROPHIES.map((t) => t.id).filter((id) => id !== "mastery");
  if (others.every((id) => met.includes(id))) met.push("mastery");
  return met;
}
