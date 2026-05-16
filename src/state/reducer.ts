import type { State, Action } from "./types";
import { computeRelative, currentWeek } from "../lib/helpers";

export const emptyState = (): State => {
  const { weekKey, weekLabel } = currentWeek();
  return {
    tab: "today",
    streak: 0,
    saved: 0,
    urgesSkipped: 0,
    weeklyBudget: 125,
    currentWeek: weekKey,
    currentWeekLabel: weekLabel,
    lastLockedStakes: 0,
    badges: [],
    goals: [],
    tasks: [],
    wants: [],
    spending: [],
    payments: [],
    sheet: null,
    sheetData: {},
    lockInOpen: false,
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
    case "PASS_GOAL":
      return {
        ...state,
        goals: state.goals.map((g) =>
          g.id === action.id
            ? { ...g, status: "Pass", relative: "passed today" }
            : g
        ),
        confettiKey: state.confettiKey + 1,
      };
    case "FAIL_GOAL":
      return {
        ...state,
        goals: state.goals.map((g) =>
          g.id === action.id ? { ...g, status: "Fail" } : g
        ),
      };
    case "RESET_GOAL":
      return {
        ...state,
        goals: state.goals.map((g) =>
          g.id === action.id
            ? { ...g, status: "Pending", relative: computeRelative(g.category) }
            : g
        ),
      };
    case "OPEN_LOCKIN": {
      const weeklyStakes = state.goals
        .filter((g) => g.category === "Weekly" && g.status === "Pass")
        .reduce((a, b) => a + Number(b.stake), 0);
      return { ...state, lockInOpen: true, lastLockedStakes: weeklyStakes };
    }
    case "CLOSE_LOCKIN": {
      const weeklyStakes = state.lastLockedStakes;
      return {
        ...state,
        lockInOpen: false,
        streak: state.streak + 1,
        saved: state.saved + weeklyStakes,
        goals: state.goals.map((g) =>
          g.category === "Weekly"
            ? { ...g, status: "Pending", relative: "due Sun" }
            : g
        ),
        confettiKey: state.confettiKey + 1,
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
      };
      return { ...state, goals: [...state.goals, g] };
    }
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
