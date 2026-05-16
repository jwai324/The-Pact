import type { Category } from "../state/types";

// ── Time helpers (ported verbatim from components.jsx) ──────────────────────
export const formatRelative = (date: Date, now: Date = new Date()): string => {
  const ms = date.getTime() - now.getTime();
  const days = Math.floor(ms / 86400000);
  if (days === 0) return "due today";
  if (days < 0) return `${-days}d overdue`;
  if (days === 1) return "1d left";
  return `${days}d left`;
};

export const formatCountdown = (
  expiresAt: number,
  now: number = Date.now()
): string => {
  const ms = expiresAt - now;
  if (ms <= 0) return "ready";
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  if (h === 0) return `${m}m left`;
  return `${h}h ${m}m left`;
};

// Relative label for a Pending goal, derived from its category so countdowns
// stay live (only Pass/Fail goals keep a stored label).
export const computeRelative = (category: Category): string => {
  const today = new Date();
  if (category === "Weekly") return "due Sun";
  if (category === "Side") return "no deadline";
  if (category === "Monthly") {
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    return formatRelative(endOfMonth);
  }
  const endOfQuarter = new Date(
    today.getFullYear(),
    Math.floor(today.getMonth() / 3) * 3 + 3,
    0
  );
  return formatRelative(endOfQuarter);
};

export const currentWeek = () => {
  const today = new Date();
  const monday = new Date(today);
  const day = monday.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  monday.setDate(monday.getDate() + diff);
  monday.setHours(0, 0, 0, 0);
  return {
    weekKey: monday.toISOString().slice(0, 10),
    weekLabel: monday.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  };
};

// ── Level system (ported verbatim from components.jsx) ──────────────────────
export interface Level {
  name: string;
  min: number;
  color: string;
  icon: string;
}

export const LEVELS: Level[] = [
  { name: "Sprout", min: 0, color: "var(--teal)", icon: "sparkle" },
  { name: "Foundation", min: 1, color: "var(--sky)", icon: "shield" },
  { name: "Builder", min: 4, color: "var(--purple)", icon: "bolt" },
  { name: "Discipline", min: 8, color: "var(--magenta)", icon: "star" },
  { name: "Mastery", min: 16, color: "var(--gold)", icon: "crown" },
];

export const getLevel = (streak: number): { lvl: Level; next: Level | null } => {
  let lvl: Level = LEVELS[0];
  let next: Level | null = LEVELS[1];
  for (let i = 0; i < LEVELS.length; i++) {
    if (streak >= LEVELS[i].min) lvl = LEVELS[i];
    if (streak < LEVELS[i].min) {
      next = LEVELS[i];
      break;
    }
    if (i === LEVELS.length - 1) next = null;
  }
  return { lvl, next };
};
