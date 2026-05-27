import type { Category, DataSlice } from "../state/types";

// Wall-clock "now" in America/New_York regardless of the device's timezone.
// The day/week/month/quarter boundaries — and the quest auto-fail sweep that
// rides on them — therefore roll over at Eastern midnight. DST-correct: Intl
// applies whichever offset (EST/EDT) is in effect for the date.
const EASTERN_TZ = "America/New_York";
export const easternNow = (): Date =>
  new Date(new Date().toLocaleString("en-US", { timeZone: EASTERN_TZ }));

const pad2 = (n: number): string => String(n).padStart(2, "0");

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
  const monday = easternNow();
  const day = monday.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  monday.setDate(monday.getDate() + diff);
  monday.setHours(0, 0, 0, 0);
  return {
    // Built from the Eastern calendar fields directly (not toISOString, which
    // would re-shift by the device's UTC offset) so the key is the Eastern
    // week-start regardless of where the browser runs.
    weekKey: `${monday.getFullYear()}-${pad2(monday.getMonth() + 1)}-${pad2(
      monday.getDate()
    )}`,
    weekLabel: monday.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  };
};

// Append newly-earned trophy ids to this week's completed set, resetting it
// when the week has rolled over since it was last written. The home cabinet
// reads this, so it naturally empties to uncompleted trophies each new week.
export const mergeWeeklyTrophies = (
  prevIds: string[],
  prevWeek: string | null,
  newIds: string[]
): { ids: string[]; week: string } => {
  const week = currentWeek().weekKey;
  const ids = prevWeek === week ? [...prevIds] : [];
  for (const id of newIds) if (!ids.includes(id)) ids.push(id);
  return { ids, week };
};

// ── Period rollover ─────────────────────────────────────────────────────────
// The app is client-only (no cron), so overdue quests are reconciled the next
// time it's opened. We persist the last period each category was reconciled
// for and compare it to the current period on load. Keys are designed so a
// plain string `<` is a correct chronological compare, including year wrap.
// Default to Eastern time so month/quarter rollover (and the auto-fail it
// triggers) lands at Eastern midnight, not the device's local midnight.
export const currentMonthKey = (now: Date = easternNow()): string =>
  `${now.getFullYear()}-${pad2(now.getMonth() + 1)}`;

export const currentQuarterKey = (now: Date = easternNow()): string =>
  `${now.getFullYear()}-Q${Math.floor(now.getMonth() / 3) + 1}`;

export interface PeriodKeys {
  weekKey: string;
  monthKey: string;
  quarterKey: string;
}

export const currentKeys = (): PeriodKeys => ({
  weekKey: currentWeek().weekKey,
  monthKey: currentMonthKey(),
  quarterKey: currentQuarterKey(),
});

export interface Rollover {
  weekly: boolean;
  monthly: boolean;
  quarterly: boolean;
  newKeys: PeriodKeys;
  changed: boolean;
}

// A null stored key means "never reconciled" — initialize it to the current
// period but fail nothing, so a fresh/seeded DB is never retro-failed.
const evalPeriod = (stored: string | null, current: string) => {
  const rolled = stored != null && stored < current;
  const newKey = stored == null || rolled ? current : stored;
  return { rolled, newKey, changed: newKey !== stored };
};

export const detectRollover = (
  data: Pick<DataSlice, "lastWeekKey" | "lastMonthKey" | "lastQuarterKey">,
  keys: PeriodKeys
): Rollover => {
  const w = evalPeriod(data.lastWeekKey, keys.weekKey);
  const m = evalPeriod(data.lastMonthKey, keys.monthKey);
  const q = evalPeriod(data.lastQuarterKey, keys.quarterKey);
  return {
    weekly: w.rolled,
    monthly: m.rolled,
    quarterly: q.rolled,
    newKeys: { weekKey: w.newKey, monthKey: m.newKey, quarterKey: q.newKey },
    changed: w.changed || m.changed || q.changed,
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
