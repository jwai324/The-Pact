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
}

export interface Task {
  id: string;
  goalId: string;
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
  badges: string[];
  goals: Goal[];
  tasks: Task[];
  wants: Want[];
  spending: Spend[];
  payments: Payment[];
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
  | { type: "LOG_SPEND"; amount: number; note: string; category: string }
  | { type: "ADD_TASK"; goalId: string; title: string; minutes: number | null }
  | { type: "TOGGLE_TASK"; id: string }
  | { type: "DELETE_TASK"; id: string }
  | { type: "LOG_PAYMENT"; amount: number; note: string; proofUrl: string };
