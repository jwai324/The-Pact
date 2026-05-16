// Main App for The Pact — gamified (ported from app.jsx; Tweaks design-harness
// removed, in-memory seed replaced with Supabase-backed store).
import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePactStore } from "./state/store";
import type { Category, State } from "./state/types";
import { Icon, Eyebrow, Display, Confetti } from "./components/ui";
import { TrophyReveal } from "./components/TrophyReveal";
import {
  TROPHIES,
  evaluateTrophies,
  type Trophy,
} from "./lib/trophies";
import {
  TodayTab,
  GoalsTab,
  TasksTab,
  WantsTab,
  SpendTab,
  PactTab,
  FutureQuestsTab,
} from "./tabs";
import {
  AddWantSheet,
  AddGoalSheet,
  AddTaskSheet,
  AddFutureGoalSheet,
  LogSpendSheet,
  EditBudgetSheet,
  LogPaymentSheet,
  LockInOverlay,
} from "./modals";

export default function App() {
  const [state, dispatch] = usePactStore();
  const [now, setNow] = useState(Date.now());

  // Easter egg: 5 taps on the home greeting opens the hidden Future Quests
  // page. Taps must be in quick succession (the counter resets after a pause).
  const tapCount = useRef(0);
  const tapTimer = useRef<number | undefined>(undefined);
  const onTitleTap = () => {
    if (state.tab !== "today") return;
    window.clearTimeout(tapTimer.current);
    tapCount.current += 1;
    if (tapCount.current >= 5) {
      tapCount.current = 0;
      dispatch({ type: "TAB", tab: "future" });
      return;
    }
    tapTimer.current = window.setTimeout(() => {
      tapCount.current = 0;
    }, 1500);
  };

  // Auto-award trophies as criteria are met, persist them, and queue a
  // reveal for any unlocked *after* the first load — so a backlog from a
  // fresh/legacy badge list is backfilled silently, not as 8 animations.
  const trophySeeded = useRef(false);
  const [revealQueue, setRevealQueue] = useState<Trophy[]>([]);
  useEffect(() => {
    if (state.loading) return;
    const met = evaluateTrophies(state);
    const newly = met.filter((id) => !state.badges.includes(id));
    if (newly.length) {
      dispatch({ type: "AWARD_BADGES", ids: newly });
      if (trophySeeded.current) {
        const ts = newly
          .map((id) => TROPHIES.find((t) => t.id === id))
          .filter((t): t is Trophy => !!t);
        if (ts.length) setRevealQueue((q) => [...q, ...ts]);
      }
    }
    trophySeeded.current = true;
  }, [
    state.loading,
    state.streak,
    state.saved,
    state.urgesSkipped,
    state.wants,
    state.goals,
    state.spending,
    state.currentWeek,
    state.badges,
    dispatch,
  ]);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(id);
  }, []);

  const openSheet = (sheet: string, data?: State["sheetData"]) =>
    dispatch({ type: "OPEN_SHEET", sheet, data });
  const closeSheet = () => dispatch({ type: "CLOSE_SHEET" });

  const tabs = [
    { id: "today", label: "Today", icon: "home", color: "var(--accent)" },
    { id: "goals", label: "Quests", icon: "target", color: "var(--purple)" },
    { id: "tasks", label: "Tasks", icon: "checkSquare", color: "var(--lime)" },
    { id: "wants", label: "Wants", icon: "timer", color: "var(--magenta)" },
    { id: "spend", label: "Spend", icon: "receipt", color: "var(--teal)" },
    { id: "pact", label: "Pact", icon: "handshake", color: "var(--gold)" },
  ];

  const tabComp: Record<string, ReactNode> = {
    today: (
      <TodayTab state={state} dispatch={dispatch} openSheet={openSheet} />
    ),
    goals: (
      <GoalsTab state={state} dispatch={dispatch} openSheet={openSheet} />
    ),
    tasks: (
      <TasksTab state={state} dispatch={dispatch} openSheet={openSheet} />
    ),
    wants: (
      <WantsTab
        state={state}
        dispatch={dispatch}
        openSheet={openSheet}
        now={now}
      />
    ),
    spend: (
      <SpendTab state={state} dispatch={dispatch} openSheet={openSheet} />
    ),
    pact: <PactTab state={state} dispatch={dispatch} openSheet={openSheet} />,
    future: (
      <FutureQuestsTab
        state={state}
        dispatch={dispatch}
        openSheet={openSheet}
      />
    ),
  };

  // Live date for the header eyebrows (re-derived from `now`, which ticks
  // every 30s, so it stays correct across midnight).
  const dateLabel = new Date(now)
    .toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
    .toUpperCase()
    .replace(", ", " · ");
  const streakLabel = `${state.streak} ${
    state.streak === 1 ? "WEEK" : "WEEKS"
  } 🔥`;

  const tabTitle: Record<string, { eyebrow: string; title: string }> = {
    today: {
      eyebrow: `${dateLabel} · ${streakLabel}`,
      title: "Hi, Maribett.",
    },
    goals: { eyebrow: "ACTIVE QUESTS", title: "Quests" },
    tasks: { eyebrow: "THE NEXT STEPS", title: "Tasks" },
    wants: { eyebrow: "THE FRICTION LAYER", title: "Want List" },
    spend: { eyebrow: `${dateLabel} · RESETS MON`, title: "Spending" },
    pact: { eyebrow: "WITH JUSTIN WAI", title: "The Pact" },
    future: { eyebrow: "HIDDEN · THE STASH", title: "Future Quests" },
  };

  return (
    <div
      style={{
        width: "100%",
        flex: 1,
        background: "var(--bg)",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          height: "max(12px, env(safe-area-inset-top))",
          flexShrink: 0,
        }}
      />

      <div style={{ padding: "8px 24px 16px", flexShrink: 0 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <Eyebrow style={{ color: "var(--accent)", fontWeight: 700 }}>
              {tabTitle[state.tab].eyebrow}
            </Eyebrow>
            <div
              style={{
                marginTop: 6,
                userSelect: "none",
                WebkitUserSelect: "none",
              }}
              onClick={onTitleTap}
            >
              <Display size={36} weight={700}>
                {tabTitle[state.tab].title}
              </Display>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                background: "white",
                border: "2px solid var(--ink)",
                boxShadow: "2px 2px 0 var(--ink)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon name="bell" size={16} color="var(--ink)" strokeWidth={2.4} />
            </div>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                background: "var(--accent)",
                border: "2px solid var(--ink)",
                boxShadow: "2px 2px 0 var(--ink)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--display)",
                fontSize: 16,
                fontWeight: 800,
                color: "white",
              }}
            >
              M
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          paddingBottom: "calc(110px + env(safe-area-inset-bottom))",
        }}
      >
        {state.loading ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              padding: "120px 24px",
              animation: "fadeUp 0.4s both",
            }}
          >
            <Display size={30} weight={700} style={{ color: "var(--ink)" }}>
              The Pact
            </Display>
            <div
              style={{
                fontFamily: "var(--mono)",
                fontSize: 11,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--ink-soft)",
                fontWeight: 700,
              }}
            >
              Loading…
            </div>
          </div>
        ) : (
          tabComp[state.tab]
        )}
      </div>

      {/* Bottom nav — fixed to viewport bottom, constrained to column */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: "50%",
          width: "100%",
          maxWidth: 480,
          transform: "translateX(-50%)",
          background: "white",
          borderTop: "2px solid var(--ink)",
          paddingTop: 8,
          paddingBottom: "max(16px, env(safe-area-inset-bottom))",
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          zIndex: 50,
        }}
      >
        {tabs.map((t) => {
          const active = state.tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => dispatch({ type: "TAB", tab: t.id })}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "6px 0 4px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 5,
                position: "relative",
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 32,
                  borderRadius: 9,
                  background: active ? t.color : "transparent",
                  border: active ? "2px solid var(--ink)" : "none",
                  boxShadow: active ? "2px 2px 0 var(--ink)" : "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 140ms",
                }}
              >
                <Icon
                  name={t.icon}
                  size={17}
                  color={active ? "white" : "var(--ink-soft)"}
                  strokeWidth={active ? 2.4 : 2}
                />
              </div>
              <span
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 8.5,
                  letterSpacing: "0.06em",
                  color: active ? "var(--ink)" : "var(--ink-soft)",
                  fontWeight: 700,
                  textTransform: "uppercase",
                }}
              >
                {t.label}
              </span>
            </button>
          );
        })}
      </div>

      <AddWantSheet
        open={state.sheet === "addWant"}
        onClose={closeSheet}
        dispatch={dispatch}
      />
      <AddGoalSheet
        open={state.sheet === "addGoal"}
        onClose={closeSheet}
        dispatch={dispatch}
        defaultCategory={state.sheetData.category as Category | undefined}
      />
      <AddTaskSheet
        open={state.sheet === "addTask"}
        onClose={closeSheet}
        dispatch={dispatch}
        goals={state.goals}
        defaultGoalId={state.sheetData.goalId}
      />
      <AddFutureGoalSheet
        open={state.sheet === "addFutureGoal"}
        onClose={closeSheet}
        dispatch={dispatch}
      />
      <LogSpendSheet
        open={state.sheet === "logSpend"}
        onClose={closeSheet}
        dispatch={dispatch}
      />
      <EditBudgetSheet
        open={state.sheet === "editBudget"}
        onClose={closeSheet}
        dispatch={dispatch}
        current={state.weeklyBudget}
      />
      <LogPaymentSheet
        open={state.sheet === "logPayment"}
        onClose={closeSheet}
        dispatch={dispatch}
        suggestedAmount={state.sheetData.amount}
      />
      <LockInOverlay
        open={state.lockInOpen}
        stakes={state.lastLockedStakes}
        weeks={state.streak + 1}
        onClose={() => dispatch({ type: "CLOSE_LOCKIN" })}
      />

      <Confetti trigger={state.confettiKey} />

      <TrophyReveal
        trophy={revealQueue[0] ?? null}
        onDone={() => setRevealQueue((q) => q.slice(1))}
      />
    </div>
  );
}
