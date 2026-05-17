export type Category = "Weekly" | "Monthly" | "Quarterly" | "Side";
export type GoalStatus = "Pass" | "Fail" | "Pending";
export type Decision = "skip" | "buy" | null;

export interface Goal {
  id: string;
  title: string;
  category: Category;
  stake: number;
  status: GoalStatus;
  relative: string;
  paid: boolean;
  sort: number;
  // Parked quest: lives only on the hidden Future Quests page, never shown
  // in active lists and never auto-failed, until pushed into a real spot.
  future: boolean;
}

export interface Task {
  id: string;
  goalId: string | null;
  title: string;
  minutes: number | null;
  done: boolean;
  sort: number;
}

export interface Want {
  id: string;
  title: string;
  price: number | null;
  addedAt: number;
  expiresAt: number;
  addedLabel?: string;
  dateLabel?: string;
  decision: Decision;
}

export interface Spend {
  id: string;
  amount: number;
  note: string;
  category: string;
  weekStart: string;
  dayLabel: string;
}

export interface Payment {
  id: string;
  amount: number;
  dateLabel: string;
  note: string;
  proofUrl: string | null;
}

export interface DataSlice {
  streak: number;
  saved: number;
  urgesSkipped: number;
  weeklyBudget: number;
  lastLockedStakes: number;
  // Trophy id -> number of times earned (cumulative; re-earnable). Display
  // only; never reflects current criteria once a count is recorded.
  badges: Record<string, number>;
  // Trophy ids whose criteria are currently met, as of the last evaluation.
  // Persisted so a not-met -> met transition (a fresh earn) can be detected
  // across reloads without re-counting every refresh.
  activeTrophies: string[];
  goals: Goal[];
  futureGoals: Goal[];
  tasks: Task[];
  wants: Want[];
  spending: Spend[];
  payments: Payment[];
  // Last period the client reconciled overdue quests for. null until the
  // first sweep initializes them (so a fresh DB never retro-fails).
  lastWeekKey: string | null;
  lastMonthKey: string | null;
  lastQuarterKey: string | null;
}

export interface State extends DataSlice {
  tab: string;
  currentWeek: string;
  currentWeekLabel: string;
  sheet: string | null;
  sheetData: { category?: Category; goalId?: string; amount?: number };
  lockInOpen: boolean;
  confettiKey: number;
  loading: boolean;
}

export type Action =
  | { type: "HYDRATE"; data: DataSlice }
  | { type: "LOAD_FAILED" }
  | { type: "TAB"; tab: string }
  | { type: "OPEN_SHEET"; sheet: string; data?: State["sheetData"] }
  | { type: "CLOSE_SHEET" }
  | { type: "PASS_GOAL"; id: string }
  | { type: "FAIL_GOAL"; id: string }
  | { type: "RESET_GOAL"; id: string }
  | { type: "OPEN_LOCKIN" }
  | { type: "CLOSE_LOCKIN" }
  | { type: "ADD_WANT"; title: string; price: number | null; hours: number }
  | { type: "DECIDE_WANT"; id: string; decision: "skip" | "buy" }
  | { type: "ADD_GOAL"; title: string; category: Category; stake: number }
  | { type: "ADD_FUTURE_GOAL"; title: string; stake: number }
  | { type: "PUSH_FUTURE_GOAL"; id: string; category: Category }
  | { type: "DELETE_FUTURE_GOAL"; id: string }
  | { type: "LOG_SPEND"; amount: number; note: string; category: string }
  | {
      type: "ADD_TASK";
      goalId: string | null;
      title: string;
      minutes: number | null;
    }
  | { type: "TOGGLE_TASK"; id: string }
  | { type: "EDIT_TASK"; id: string; title: string }
  | { type: "EDIT_GOAL"; id: string; title: string }
  | { type: "DELETE_TASK"; id: string }
  | { type: "DELETE_GOAL"; id: string }
  | { type: "DELETE_WANT"; id: string }
  | { type: "DELETE_SPEND"; id: string }
  | { type: "RESET_URGES" }
  | { type: "AWARD_BADGES"; ids: string[]; active: string[] }
  | { type: "ADD_BADGE"; id: string }
  | { type: "REMOVE_BADGE"; id: string }
  | { type: "SET_BUDGET"; amount: number }
  | { type: "SET_STREAK"; value: number }
  | { type: "SET_SAVED"; value: number }
  | { type: "LOG_PAYMENT"; amount: number; note: string; proofUrl: string };
