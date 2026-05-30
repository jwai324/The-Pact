import type { State, Action, Goal } from "./types";
import {
  computeRelative,
  currentWeek,
  mergeWeeklyTrophies,
} from "../lib/helpers";

export const emptyState = (): State => {
  const { weekKey, weekLabel } = currentWeek();
  return {
    tab: "today",
    streak: 0,
    saved: 0,
    urgesSkipped: 0,
    budgets: { necessities: 100, semiNecessities: 50, discretionary: 50 },
    currentWeek: weekKey,
    currentWeekLabel: weekLabel,
    badges: {},
    activeTrophies: [],
    seenTrophies: [],
    weeklyTrophies: [],
    weeklyTrophyWeek: null,
    goals: [],
    futureGoals: [],
    tasks: [],
    wants: [],
    spending: [],
    payments: [],
    lastWeekKey: null,
    lastMonthKey: null,
    lastQuarterKey: null,
    sheet: null,
    sheetData: {},
    confettiKey: 0,
    loading: true,
  };
};

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "HYDRATE":
      return { ...state, ...action.data, loading: false };
    case "LOAD_FAILED":
      // Initial fetch failed — leave defaults in place but drop the splash so
      // the app shell renders instead of an indefinite "Loading…".
      return { ...state, loading: false };
    case "TAB":
      return { ...state, tab: action.tab };
    case "OPEN_SHEET":
      return { ...state, sheet: action.sheet, sheetData: action.data || {} };
    case "CLOSE_SHEET":
      return { ...state, sheet: null };
    case "PASS_GOAL": {
      // Passing a quest means its stake never reaches the anti-charity, so
      // credit it to the home "Saved from anti-charity" total immediately.
      const passed = state.goals.find((g) => g.id === action.id);
      return {
        ...state,
        saved: state.saved + Number(passed?.stake ?? 0),
        goals: state.goals.map((g) =>
          g.id === action.id
            ? { ...g, status: "Pass", relative: "passed today" }
            : g
        ),
        tasks: state.tasks.map((t) =>
          t.goalId === action.id && !t.done ? { ...t, done: true } : t
        ),
        confettiKey: state.confettiKey + 1,
      };
    }
    case "FAIL_GOAL":
      return {
        ...state,
        goals: state.goals.map((g) =>
          g.id === action.id ? { ...g, status: "Fail" } : g
        ),
      };
    case "RESET_GOAL": {
      // Undoing a pass returns the stake to "at risk", so reverse the credit
      // PASS_GOAL applied. Clamp at 0 to stay safe for goals that were already
      // "Pass" before per-pass crediting existed.
      const reset = state.goals.find((g) => g.id === action.id);
      const refund = reset?.status === "Pass" ? Number(reset.stake) : 0;
      return {
        ...state,
        saved: Math.max(0, state.saved - refund),
        goals: state.goals.map((g) =>
          g.id === action.id
            ? { ...g, status: "Pending", relative: computeRelative(g.category) }
            : g
        ),
      };
    }
    case "ADD_WANT": {
      const w = {
        id: "w" + Date.now(),
        title: action.title,
        price: action.price,
        addedAt: Date.now(),
        expiresAt: Date.now() + action.hours * 3600 * 1000,
        addedLabel: "just now",
        decision: null as null,
      };
      return { ...state, wants: [w, ...state.wants] };
    }
    case "DECIDE_WANT": {
      const wants = state.wants.map((w) =>
        w.id === action.id
          ? { ...w, decision: action.decision, dateLabel: "today" }
          : w
      );
      const inc = action.decision === "skip" ? 1 : 0;
      return {
        ...state,
        wants,
        urgesSkipped: state.urgesSkipped + inc,
        confettiKey:
          action.decision === "skip"
            ? state.confettiKey + 1
            : state.confettiKey,
      };
    }
    case "DELETE_WANT":
      return {
        ...state,
        wants: state.wants.filter((w) => w.id !== action.id),
      };
    case "DELETE_SPEND":
      return {
        ...state,
        spending: state.spending.filter((s) => s.id !== action.id),
      };
    case "RESET_URGES":
      // Erase decided history and zero the lifetime skip counter so the
      // "Urges skipped" total (urgesSkipped + decided skips) reads 0.
      return {
        ...state,
        wants: state.wants.filter((w) => !w.decision),
        urgesSkipped: 0,
      };
    case "AWARD_BADGES": {
      // ids = trophies that just transitioned not-met -> met (each bumps its
      // lifetime count). active = the full currently-met set, stored so the
      // next evaluation can tell a fresh earn from a still-held one.
      const badges = { ...state.badges };
      for (const id of action.ids) badges[id] = (badges[id] ?? 0) + 1;
      const weekly = mergeWeeklyTrophies(
        state.weeklyTrophies,
        state.weeklyTrophyWeek,
        action.ids
      );
      return {
        ...state,
        badges,
        activeTrophies: action.active,
        weeklyTrophies: weekly.ids,
        weeklyTrophyWeek: weekly.week,
      };
    }
    case "ADD_BADGE": {
      // Manual earn (hidden Future Quests screen). Bumps the lifetime count
      // only; activeTrophies is left to the evaluator (badges isn't an
      // evaluator dep, so this won't trigger a re-award).
      const badges = { ...state.badges };
      badges[action.id] = (badges[action.id] ?? 0) + 1;
      const weekly = mergeWeeklyTrophies(
        state.weeklyTrophies,
        state.weeklyTrophyWeek,
        [action.id]
      );
      return {
        ...state,
        badges,
        weeklyTrophies: weekly.ids,
        weeklyTrophyWeek: weekly.week,
      };
    }
    case "REMOVE_BADGE": {
      // Manual un-earn: decrement by one, dropping the key at zero so the
      // cabinet reads it as locked. Once fully un-earned, forget it was seen
      // so a future re-earn shows the "new" stamp again.
      const badges = { ...state.badges };
      const next = (badges[action.id] ?? 0) - 1;
      if (next > 0) badges[action.id] = next;
      else delete badges[action.id];
      const seenTrophies =
        next > 0
          ? state.seenTrophies
          : state.seenTrophies.filter((x) => x !== action.id);
      const weeklyTrophies =
        next > 0
          ? state.weeklyTrophies
          : state.weeklyTrophies.filter((x) => x !== action.id);
      return { ...state, badges, seenTrophies, weeklyTrophies };
    }
    case "SEE_TROPHY":
      // The user opened this trophy's detail — clear its "new" stamp.
      return state.seenTrophies.includes(action.id)
        ? state
        : { ...state, seenTrophies: [...state.seenTrophies, action.id] };
    case "SET_BUDGET": {
      const key =
        action.category === "Necessities"
          ? "necessities"
          : action.category === "Semi-necessities"
          ? "semiNecessities"
          : "discretionary";
      return {
        ...state,
        budgets: { ...state.budgets, [key]: action.amount },
      };
    }
    case "SET_STREAK":
      return { ...state, streak: action.value };
    case "SET_SAVED":
      return { ...state, saved: action.value };
    case "ADD_GOAL": {
      const g = {
        id: "g" + Date.now(),
        title: action.title,
        category: action.category,
        stake: action.stake,
        status: "Pending" as const,
        relative: computeRelative(action.category),
        paid: false,
        sort:
          Math.max(0, ...state.goals.map((x) => x.sort)) + 1,
        future: false,
      };
      return { ...state, goals: [...state.goals, g] };
    }
    case "ADD_FUTURE_GOAL": {
      // Parked: no real spot yet (placeholder category, chosen on push),
      // and excluded from auto-fail until then.
      const g = {
        id: "g" + Date.now(),
        title: action.title,
        category: "Side" as const,
        stake: action.stake,
        status: "Pending" as const,
        relative: "",
        paid: false,
        sort: Math.max(0, ...state.futureGoals.map((x) => x.sort)) + 1,
        future: true,
      };
      return { ...state, futureGoals: [...state.futureGoals, g] };
    }
    case "PUSH_FUTURE_GOAL": {
      const g = state.futureGoals.find((x) => x.id === action.id);
      if (!g) return state;
      const promoted: Goal = {
        ...g,
        category: action.category,
        status: "Pending",
        relative: computeRelative(action.category),
        future: false,
        sort: Math.max(0, ...state.goals.map((x) => x.sort)) + 1,
      };
      return {
        ...state,
        futureGoals: state.futureGoals.filter((x) => x.id !== action.id),
        goals: [...state.goals, promoted],
      };
    }
    case "RECATEGORIZE_GOAL": {
      // Move an active quest to a different category. Its tasks stay attached
      // via goalId, so they come along automatically. The deadline and stake
      // are reset to the new category's defaults (Side has no stake).
      const stake =
        action.category === "Weekly"
          ? 50
          : action.category === "Monthly"
          ? 100
          : action.category === "Side"
          ? 0
          : 150;
      return {
        ...state,
        goals: state.goals.map((g) =>
          g.id === action.id
            ? {
                ...g,
                category: action.category,
                relative: computeRelative(action.category),
                stake,
              }
            : g
        ),
      };
    }
    case "DELETE_FUTURE_GOAL":
      return {
        ...state,
        futureGoals: state.futureGoals.filter((g) => g.id !== action.id),
      };
    case "LOG_SPEND": {
      const s = {
        id: "s" + Date.now(),
        amount: action.amount,
        note: action.note,
        category: action.category,
        weekStart: state.currentWeek,
        dayLabel: "today",
      };
      return { ...state, spending: [s, ...state.spending] };
    }
    case "ADD_TASK": {
      const t = {
        id: "t" + Date.now(),
        goalId: action.goalId,
        title: action.title,
        minutes: action.minutes || null,
        done: false,
        sort: Math.max(0, ...state.tasks.map((x) => x.sort)) + 1,
      };
      return { ...state, tasks: [...state.tasks, t] };
    }
    case "TOGGLE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.id ? { ...t, done: !t.done } : t
        ),
      };
    case "EDIT_TASK":
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.id ? { ...t, title: action.title } : t
        ),
      };
    case "EDIT_GOAL":
      return {
        ...state,
        goals: state.goals.map((g) =>
          g.id === action.id ? { ...g, title: action.title } : g
        ),
      };
    case "DELETE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter((t) => t.id !== action.id),
      };
    case "DELETE_GOAL":
      // Mirror the DB's ON DELETE CASCADE so optimistic state stays
      // consistent before the refetch reconciles.
      return {
        ...state,
        goals: state.goals.filter((g) => g.id !== action.id),
        tasks: state.tasks.filter((t) => t.goalId !== action.id),
      };
    case "LOG_PAYMENT": {
      let remaining = action.amount;
      const goals = state.goals.map((g) => {
        if (g.status === "Fail" && !g.paid && remaining >= Number(g.stake)) {
          remaining -= Number(g.stake);
          return { ...g, paid: true };
        }
        return g;
      });
      const p = {
        id: "p" + Date.now(),
        amount: action.amount,
        dateLabel: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        note: action.note,
        proofUrl: action.proofUrl || null,
      };
      return { ...state, payments: [p, ...state.payments], goals };
    }
    default:
      return state;
  }
}
