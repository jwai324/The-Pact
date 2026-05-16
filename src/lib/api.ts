import { supabase } from "./supabase";
import { computeRelative } from "./helpers";
import type {
  Action,
  Category,
  DataSlice,
  Goal,
  GoalStatus,
  Payment,
  Spend,
  State,
  Task,
  Want,
} from "../state/types";

const ms = (v: string | null): number => (v ? new Date(v).getTime() : 0);

export async function fetchAll(): Promise<DataSlice> {
  const [appStateRes, goalsRes, tasksRes, wantsRes, spendRes, payRes] =
    await Promise.all([
      supabase.from("app_state").select("*").eq("id", 1).single(),
      supabase.from("goals").select("*").order("sort", { ascending: true }),
      supabase.from("tasks").select("*").order("sort", { ascending: true }),
      supabase
        .from("wants")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .from("spending")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .from("payments")
        .select("*")
        .order("created_at", { ascending: false }),
    ]);

  // Surface a failed read instead of silently treating it as "no data".
  // supabase-js resolves (does not reject) on query errors, so without this
  // an auth/network failure would yield empty arrays here and the store's
  // post-write refetch would HYDRATE that emptiness over good optimistic /
  // seeded state (the "shows up then disappears" bug). Throwing instead lets
  // the store dispatch LOAD_FAILED, which preserves current state.
  const firstError =
    appStateRes.error ||
    goalsRes.error ||
    tasksRes.error ||
    wantsRes.error ||
    spendRes.error ||
    payRes.error;
  if (firstError) {
    throw new Error(`fetchAll failed: ${firstError.message}`);
  }

  const a = appStateRes.data;

  const goals: Goal[] = (goalsRes.data || []).map((g) => ({
    id: g.id,
    title: g.title,
    category: g.category as Category,
    stake: Number(g.stake),
    status: g.status as GoalStatus,
    relative:
      g.status === "Pending"
        ? computeRelative(g.category as Category)
        : g.relative || "",
    paid: !!g.paid,
    sort: g.sort,
  }));

  const tasks: Task[] = (tasksRes.data || []).map((t) => ({
    id: t.id,
    goalId: t.goal_id,
    title: t.title,
    minutes: t.minutes ?? null,
    done: !!t.done,
    sort: t.sort,
  }));

  const wants: Want[] = (wantsRes.data || []).map((w) => ({
    id: w.id,
    title: w.title,
    price: w.price != null ? Number(w.price) : null,
    addedAt: ms(w.added_at),
    expiresAt: ms(w.expires_at),
    addedLabel: w.added_label ?? undefined,
    dateLabel: w.date_label ?? undefined,
    decision: (w.decision as Want["decision"]) ?? null,
  }));

  const spending: Spend[] = (spendRes.data || []).map((s) => ({
    id: s.id,
    amount: Number(s.amount),
    note: s.note || "",
    category: s.category || "",
    weekStart: s.week_start,
    dayLabel: s.day_label || "",
  }));

  const payments: Payment[] = (payRes.data || []).map((p) => ({
    id: p.id,
    amount: Number(p.amount),
    dateLabel: p.date_label || "",
    note: p.note || "",
    proofUrl: p.proof_url ?? null,
  }));

  return {
    streak: a?.streak ?? 0,
    saved: a ? Number(a.saved) : 0,
    urgesSkipped: a?.urges_skipped ?? 0,
    weeklyBudget: a ? Number(a.weekly_budget) : 125,
    lastLockedStakes: a ? Number(a.last_locked_stakes) : 0,
    badges: (a?.badges as string[]) ?? [],
    goals,
    tasks,
    wants,
    spending,
    payments,
  };
}

// Mirror a dispatched action to Supabase. `prev` is state BEFORE the action.
// Errors are swallowed; the subsequent refetch reconciles to DB truth, which
// acts as an automatic rollback for failed optimistic writes.
export async function persist(action: Action, prev: State): Promise<boolean> {
  try {
    switch (action.type) {
      case "PASS_GOAL":
        await supabase
          .from("goals")
          .update({ status: "Pass", relative: "passed today" })
          .eq("id", action.id);
        return true;
      case "FAIL_GOAL": {
        const g = prev.goals.find((x) => x.id === action.id);
        await supabase
          .from("goals")
          .update({
            status: "Fail",
            relative: g?.relative || computeRelative(g?.category || "Weekly"),
          })
          .eq("id", action.id);
        return true;
      }
      case "RESET_GOAL":
        await supabase
          .from("goals")
          .update({ status: "Pending", relative: null })
          .eq("id", action.id);
        return true;
      case "OPEN_LOCKIN": {
        const weeklyStakes = prev.goals
          .filter((g) => g.category === "Weekly" && g.status === "Pass")
          .reduce((acc, b) => acc + Number(b.stake), 0);
        await supabase
          .from("app_state")
          .update({ last_locked_stakes: weeklyStakes })
          .eq("id", 1);
        return true;
      }
      case "CLOSE_LOCKIN": {
        await supabase
          .from("app_state")
          .update({
            streak: prev.streak + 1,
            saved: prev.saved + prev.lastLockedStakes,
          })
          .eq("id", 1);
        await supabase
          .from("goals")
          .update({ status: "Pending", relative: null })
          .eq("category", "Weekly");
        return true;
      }
      case "ADD_WANT": {
        const nowIso = new Date().toISOString();
        const expIso = new Date(
          Date.now() + action.hours * 3600 * 1000
        ).toISOString();
        await supabase.from("wants").insert({
          title: action.title,
          price: action.price,
          added_at: nowIso,
          expires_at: expIso,
          added_label: "just now",
          decision: null,
        });
        return true;
      }
      case "DECIDE_WANT": {
        await supabase
          .from("wants")
          .update({ decision: action.decision, date_label: "today" })
          .eq("id", action.id);
        if (action.decision === "skip") {
          await supabase
            .from("app_state")
            .update({ urges_skipped: prev.urgesSkipped + 1 })
            .eq("id", 1);
        }
        return true;
      }
      case "DELETE_WANT":
        await supabase.from("wants").delete().eq("id", action.id);
        return true;
      case "DELETE_SPEND":
        await supabase.from("spending").delete().eq("id", action.id);
        return true;
      case "RESET_URGES": {
        // Erase decided history; pending wants (decision IS NULL) stay.
        await supabase.from("wants").delete().not("decision", "is", null);
        await supabase
          .from("app_state")
          .update({ urges_skipped: 0 })
          .eq("id", 1);
        return true;
      }
      case "ADD_GOAL": {
        const nextSort = Math.max(0, ...prev.goals.map((g) => g.sort)) + 1;
        await supabase.from("goals").insert({
          title: action.title,
          category: action.category,
          stake: action.stake,
          status: "Pending",
          relative: null,
          paid: false,
          sort: nextSort,
        });
        return true;
      }
      case "LOG_SPEND":
        await supabase.from("spending").insert({
          amount: action.amount,
          note: action.note,
          category: action.category,
          week_start: prev.currentWeek,
          day_label: "today",
        });
        return true;
      case "ADD_TASK": {
        const nextSort = Math.max(0, ...prev.tasks.map((t) => t.sort)) + 1;
        await supabase.from("tasks").insert({
          goal_id: action.goalId,
          title: action.title,
          minutes: action.minutes,
          done: false,
          sort: nextSort,
        });
        return true;
      }
      case "TOGGLE_TASK": {
        const t = prev.tasks.find((x) => x.id === action.id);
        await supabase
          .from("tasks")
          .update({ done: !(t?.done ?? false) })
          .eq("id", action.id);
        return true;
      }
      case "EDIT_TASK":
        await supabase
          .from("tasks")
          .update({ title: action.title })
          .eq("id", action.id);
        return true;
      case "DELETE_TASK":
        await supabase.from("tasks").delete().eq("id", action.id);
        return true;
      case "DELETE_GOAL":
        // tasks rows cascade-delete via the goal_id FK (schema 0001).
        await supabase.from("goals").delete().eq("id", action.id);
        return true;
      case "LOG_PAYMENT": {
        let remaining = action.amount;
        const paidIds: string[] = [];
        for (const g of prev.goals) {
          if (g.status === "Fail" && !g.paid && remaining >= Number(g.stake)) {
            remaining -= Number(g.stake);
            paidIds.push(g.id);
          }
        }
        await supabase.from("payments").insert({
          amount: action.amount,
          date_label: new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          note: action.note,
          proof_url: action.proofUrl || null,
        });
        if (paidIds.length) {
          await supabase
            .from("goals")
            .update({ paid: true })
            .in("id", paidIds);
        }
        return true;
      }
      default:
        return false; // TAB / OPEN_SHEET / CLOSE_SHEET / HYDRATE — UI only
    }
  } catch (err) {
    console.error("[persist] write failed", action.type, err);
    return true; // still refetch to reconcile
  }
}
