// Tab views for The Pact — gamified theme (ported from tabs.jsx)
import { useState } from "react";
import {
  Card,
  Icon,
  Display,
  Pill,
  Divider,
  Button,
  Eyebrow,
  Money,
  ProgressBar,
  StreakFlame,
  SegmentedControl,
  Sheet,
  InlineEditText,
  getLevel,
  formatCountdown,
} from "./components/ui";
import type { Action, Goal, State, Task, Want } from "./state/types";
import { TROPHIES, type Trophy } from "./lib/trophies";

type Dispatch = (a: Action) => void;
type OpenSheet = (sheet: string, data?: State["sheetData"]) => void;

export const TodayTab = ({
  state,
  dispatch,
  openSheet,
}: {
  state: State;
  dispatch: Dispatch;
  openSheet: OpenSheet;
}) => {
  const weeklyGoals = state.goals.filter((g) => g.category === "Weekly");
  const allPass =
    weeklyGoals.every((g) => g.status === "Pass") && weeklyGoals.length > 0;
  const weeklySpent = state.spending
    .filter((s) => s.weekStart === state.currentWeek)
    .reduce((a, b) => a + b.amount, 0);
  const owed = state.goals
    .filter((g) => g.status === "Fail" && !g.paid)
    .reduce((a, b) => a + Number(b.stake), 0);
  const { lvl, next } = getLevel(state.streak);

  const earnedCount = TROPHIES.filter(
    (t) => (state.badges[t.id] ?? 0) > 0
  ).length;
  const [openTrophy, setOpenTrophy] = useState<Trophy | null>(null);

  return (
    <div
      style={{
        padding: "8px 20px 24px",
        display: "flex",
        flexDirection: "column",
        gap: 18,
      }}
    >
      {/* Hero — XP card */}
      <Card
        padded={false}
        color="var(--ink)"
        style={{
          padding: "22px",
          color: "white",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", top: 12, right: 14, opacity: 0.5 }}>
          <Icon name="sparkle" size={20} />
        </div>
        <div
          style={{ position: "absolute", bottom: 16, right: 60, opacity: 0.3 }}
        >
          <Icon name="sparkle" size={12} />
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 10,
          }}
        >
          <Icon name="coin" size={16} />
          <span
            style={{
              fontFamily: "var(--mono)",
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.7)",
              fontWeight: 600,
            }}
          >
            Saved from anti-charity
          </span>
        </div>
        <div
          style={{
            fontFamily: "var(--display)",
            fontSize: 72,
            lineHeight: 0.9,
            fontWeight: 700,
            letterSpacing: "-0.035em",
            color: "var(--lime)",
            fontVariantNumeric: "tabular-nums",
            textShadow: "3px 3px 0 var(--lime-deep)",
          }}
        >
          ${state.saved.toLocaleString()}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginTop: 18,
          }}
        >
          <StreakFlame count={state.streak} size={56} />
          <div style={{ flex: 1 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginBottom: 4,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 10,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.6)",
                  fontWeight: 600,
                }}
              >
                Level
              </span>
              <span
                style={{
                  fontFamily: "var(--display)",
                  fontSize: 18,
                  fontWeight: 700,
                  color: lvl.color,
                }}
              >
                {lvl.name}
              </span>
            </div>
            {next ? (
              <>
                <ProgressBar
                  value={state.streak - lvl.min}
                  max={next.min - lvl.min}
                  color={next.color}
                  height={10}
                />
                <div
                  style={{
                    marginTop: 6,
                    fontFamily: "var(--mono)",
                    fontSize: 10.5,
                    color: "rgba(255,255,255,0.7)",
                    letterSpacing: "0.04em",
                  }}
                >
                  {next.min - state.streak} weeks →{" "}
                  <span style={{ color: next.color, fontWeight: 700 }}>
                    {next.name}
                  </span>
                </div>
              </>
            ) : (
              <div
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 11,
                  color: "var(--gold)",
                  fontWeight: 600,
                }}
              >
                MAX LEVEL ⚡
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Tempted to buy — playful CTA */}
      <button
        onClick={() => openSheet("addWant")}
        style={{
          height: 86,
          borderRadius: 18,
          border: "2px solid var(--ink)",
          background: "var(--accent)",
          color: "white",
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "0 20px",
          cursor: "pointer",
          fontFamily: "var(--body)",
          boxShadow: "5px 5px 0 var(--accent-deep)",
          position: "relative",
          overflow: "hidden",
          textAlign: "left",
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 14,
            background: "white",
            border: "2px solid var(--ink)",
            boxShadow: "2px 2px 0 var(--ink)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "float 2.4s ease-in-out infinite",
          }}
        >
          <span style={{ fontSize: 28 }}>🛍️</span>
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontFamily: "var(--display)",
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1,
            }}
          >
            Tempted to buy?
          </div>
          <div
            style={{
              fontSize: 12,
              color: "rgba(255,255,255,0.85)",
              fontFamily: "var(--mono)",
              marginTop: 5,
              letterSpacing: "0.06em",
              fontWeight: 600,
            }}
          >
            DROP IT IN · WAIT 24H · WIN
          </div>
        </div>
        <Icon name="chevronRight" size={22} strokeWidth={2.5} />
      </button>

      {/* This week panel */}
      <Card padded={false} style={{ padding: "20px 22px" }} color="white">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <Display size={26} weight={700}>
            This Week
          </Display>
          <Pill tone="purple">
            {weeklyGoals.filter((g) => g.status === "Pass").length} /{" "}
            {weeklyGoals.length} ✓
          </Pill>
        </div>
        <div
          style={{ display: "flex", flexDirection: "column", gap: 14 }}
        >
          {weeklyGoals.map((g, i) => (
            <div key={g.id}>
              {i > 0 && <Divider style={{ marginBottom: 14 }} />}
              <GoalRow goal={g} dispatch={dispatch} compact />
            </div>
          ))}
        </div>
        {allPass && (
          <button
            onClick={() => dispatch({ type: "OPEN_LOCKIN" })}
            style={{
              marginTop: 20,
              height: 64,
              width: "100%",
              borderRadius: 16,
              background: "var(--lime)",
              color: "var(--ink)",
              border: "2px solid var(--ink)",
              fontFamily: "var(--display)",
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: "-0.01em",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              boxShadow: "5px 5px 0 var(--lime-deep)",
              animation: "pulseGlow 1.6s ease-in-out infinite",
            }}
          >
            <Icon name="lock" size={20} strokeWidth={2.5} color="var(--ink)" />{" "}
            LOCK IN WEEK
          </button>
        )}
      </Card>

      {/* Stat tiles - colorful */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 14,
        }}
      >
        <Card padded={false} color="var(--teal-soft)" style={{ padding: 18 }}>
          <Eyebrow>Spent / Budget</Eyebrow>
          <div
            style={{
              marginTop: 8,
              marginBottom: 12,
              display: "flex",
              alignItems: "baseline",
              gap: 4,
            }}
          >
            <Money amount={weeklySpent} size={26} weight={700} />
            <span
              style={{
                fontFamily: "var(--mono)",
                fontSize: 12,
                color: "var(--ink-soft)",
              }}
            >
              /${state.weeklyBudget}
            </span>
          </div>
          <ProgressBar
            value={weeklySpent}
            max={state.weeklyBudget}
            color={
              weeklySpent > state.weeklyBudget
                ? "var(--red)"
                : weeklySpent > state.weeklyBudget * 0.8
                ? "var(--gold)"
                : "var(--teal)"
            }
            height={10}
          />
        </Card>
        <Card
          padded={false}
          color={owed > 0 ? "var(--red-soft)" : "var(--green-soft)"}
          onClick={() => dispatch({ type: "TAB", tab: "pact" })}
          style={{ padding: 18 }}
        >
          <Eyebrow>Owed</Eyebrow>
          <div style={{ marginTop: 8, marginBottom: 12 }}>
            <Money
              amount={owed}
              size={26}
              weight={700}
              color={owed > 0 ? "var(--red)" : "var(--green)"}
            />
          </div>
          <span
            style={{
              fontFamily: "var(--mono)",
              fontSize: 11,
              color: "var(--ink-soft)",
              letterSpacing: "0.04em",
              fontWeight: 600,
            }}
          >
            {owed > 0 ? "→ pay in 3 days" : "ALL CLEAR ✓"}
          </span>
        </Card>
      </div>

      {/* Badges row - bigger, juicier */}
      <Card
        padded={false}
        style={{ padding: "20px 22px" }}
        color="var(--purple-soft)"
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 14,
          }}
        >
          <Eyebrow>Trophy Cabinet</Eyebrow>
          <span
            style={{
              fontFamily: "var(--mono)",
              fontSize: 11,
              color: "var(--purple)",
              fontWeight: 700,
            }}
          >
            {earnedCount}/{TROPHIES.length}
          </span>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 10,
          }}
        >
          {TROPHIES.map((t) => {
            const count = state.badges[t.id] ?? 0;
            const earned = count > 0;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setOpenTrophy(t)}
                aria-label={`${t.name}${
                  earned
                    ? ` (earned${count > 1 ? ` ${count} times` : ""})`
                    : " — how to earn"
                }`}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                  opacity: earned ? 1 : 0.32,
                  filter: earned ? "none" : "grayscale(0.5)",
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  font: "inherit",
                }}
              >
                <div
                  id={`trophy-slot-${t.id}`}
                  style={{
                    position: "relative",
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    background: earned ? t.color : "white",
                    border: "2px solid var(--ink)",
                    boxShadow: earned ? "2px 2px 0 var(--ink)" : "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {count > 1 && (
                    <span
                      style={{
                        position: "absolute",
                        top: -7,
                        right: -7,
                        minWidth: 18,
                        height: 18,
                        padding: "0 4px",
                        borderRadius: 9,
                        background: "var(--ink)",
                        color: "white",
                        border: "2px solid white",
                        fontFamily: "var(--mono)",
                        fontSize: 9,
                        fontWeight: 700,
                        lineHeight: "14px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      ×{count}
                    </span>
                  )}
                  <Icon
                    name={t.icon}
                    size={22}
                    color="white"
                    strokeWidth={2.2}
                  />
                </div>
                <span
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: 9.5,
                    color: "var(--ink)",
                    fontWeight: 600,
                    letterSpacing: "0.02em",
                    textAlign: "center",
                  }}
                >
                  {t.name}
                </span>
              </button>
            );
          })}
        </div>
      </Card>

      <Sheet
        open={!!openTrophy}
        onClose={() => setOpenTrophy(null)}
        title={
          openTrophy
            ? `${openTrophy.name} ${
                (state.badges[openTrophy.id] ?? 0) > 0 ? "🏆" : "🔒"
              }`
            : ""
        }
      >
        {openTrophy && (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 20,
                  background: openTrophy.color,
                  border: "2px solid var(--ink)",
                  boxShadow: "3px 3px 0 var(--ink)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon
                  name={openTrophy.icon}
                  size={34}
                  color="white"
                  strokeWidth={2.2}
                />
              </div>
            </div>
            <Eyebrow>
              {(state.badges[openTrophy.id] ?? 0) > 1
                ? `Earned ×${state.badges[openTrophy.id]}`
                : (state.badges[openTrophy.id] ?? 0) > 0
                ? "Earned"
                : "How to earn it"}
            </Eyebrow>
            <div
              style={{
                fontFamily: "var(--body)",
                fontSize: 15,
                color: "var(--ink-soft)",
                marginTop: 8,
                lineHeight: 1.55,
                fontWeight: 500,
              }}
            >
              {openTrophy.how}
            </div>
          </>
        )}
      </Sheet>
    </div>
  );
};

// Goal row — colorful states
export const GoalRow = ({
  goal,
  dispatch,
  tasks = [],
  hideStake = false,
  onAddTask,
  onDelete,
}: {
  goal: Goal;
  dispatch: Dispatch;
  compact?: boolean;
  tasks?: Task[];
  hideStake?: boolean;
  onAddTask?: () => void;
  onDelete?: () => void;
}) => {
  const tone =
    goal.status === "Pass" ? "pass" : goal.status === "Fail" ? "fail" : "pending";
  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((t) => t.done).length;
  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 12,
          marginBottom: 10,
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: 5 }}>
            <InlineEditText
              value={goal.title}
              ariaLabel="Edit quest"
              onCommit={(title) =>
                dispatch({ type: "EDIT_GOAL", id: goal.id, title })
              }
              textStyle={{
                fontFamily: "var(--body)",
                fontSize: 15,
                fontWeight: 600,
                color: "var(--ink)",
                lineHeight: 1.35,
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontFamily: "var(--mono)",
                fontSize: 11,
                color: "var(--ink-soft)",
                fontWeight: 500,
                letterSpacing: "0.02em",
              }}
            >
              {goal.relative}
            </span>
            {!hideStake && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 3,
                  fontFamily: "var(--mono)",
                  fontSize: 11,
                  color: "var(--gold)",
                  fontWeight: 700,
                  letterSpacing: "0.02em",
                }}
              >
                <Icon name="coin" size={12} />${goal.stake}
              </span>
            )}
            {totalTasks > 0 && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  fontFamily: "var(--mono)",
                  fontSize: 11,
                  color: "var(--sky)",
                  fontWeight: 700,
                  letterSpacing: "0.02em",
                }}
              >
                <Icon name="checkSquare" size={12} strokeWidth={2.4} />
                {doneTasks}/{totalTasks} tasks
              </span>
            )}
          </div>
          {totalTasks > 0 && (
            <div style={{ marginTop: 8, maxWidth: 220 }}>
              <ProgressBar
                value={doneTasks}
                max={totalTasks}
                color="var(--sky)"
                height={6}
              />
            </div>
          )}
        </div>
        <Pill tone={tone}>
          {goal.status === "Pass"
            ? "WIN ✓"
            : goal.status === "Fail"
            ? "MISS"
            : "OPEN"}
        </Pill>
      </div>
      {goal.status === "Pending" && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Button
            size="sm"
            variant="lime"
            onClick={() => dispatch({ type: "PASS_GOAL", id: goal.id })}
          >
            <Icon
              name="check"
              size={14}
              strokeWidth={2.6}
              color="var(--ink)"
            />{" "}
            Pass
          </Button>
          {!hideStake && (
            <Button
              size="sm"
              variant="fail"
              onClick={() => dispatch({ type: "FAIL_GOAL", id: goal.id })}
            >
              Fail
            </Button>
          )}
          {onAddTask && (
            <Button size="sm" variant="ghost" onClick={onAddTask}>
              <Icon name="plus" size={13} strokeWidth={2.6} /> Task
            </Button>
          )}
        </div>
      )}
      {goal.status !== "Pending" && (
        <button
          onClick={() => dispatch({ type: "RESET_GOAL", id: goal.id })}
          style={{
            background: "transparent",
            border: "none",
            padding: 0,
            cursor: "pointer",
            fontFamily: "var(--mono)",
            fontSize: 11,
            color: "var(--ink-soft)",
            textDecoration: "underline",
            letterSpacing: "0.04em",
            fontWeight: 600,
          }}
        >
          ↺ undo
        </button>
      )}
      {onDelete && (
        <button
          onClick={onDelete}
          aria-label={`Delete quest: ${goal.title}`}
          style={{
            marginTop: 12,
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            background: "transparent",
            border: "none",
            padding: 0,
            cursor: "pointer",
            fontFamily: "var(--mono)",
            fontSize: 11,
            color: "var(--red)",
            textDecoration: "underline",
            letterSpacing: "0.04em",
            fontWeight: 600,
          }}
        >
          <Icon name="x" size={12} strokeWidth={2.6} color="var(--red)" />{" "}
          Delete quest
        </button>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
export const GoalsTab = ({
  state,
  dispatch,
  openSheet,
}: {
  state: State;
  dispatch: Dispatch;
  openSheet: OpenSheet;
}) => {
  const [sub, setSub] = useState<string>("Weekly");
  const filtered = state.goals.filter((g) => g.category === sub);
  const activeGoals = filtered.filter((g) => g.status === "Pending");
  const historyGoals = filtered.filter((g) => g.status !== "Pending");
  const stakeByCat: Record<string, number> = {
    Weekly: 50,
    Monthly: 100,
    Quarterly: 150,
    Side: 0,
  };
  const colorByCat: Record<string, string> = {
    Weekly: "var(--accent)",
    Monthly: "var(--purple)",
    Quarterly: "var(--magenta)",
    Side: "var(--teal)",
  };
  const labelByCat: Record<string, string> = {
    Weekly: "Active Quests",
    Monthly: "Monthly Mission",
    Quarterly: "Quarterly Boss",
    Side: "Side Quests",
  };

  return (
    <div
      style={{
        padding: "8px 20px 24px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <SegmentedControl
        options={["Weekly", "Monthly", "Quarterly", "Side"]}
        value={sub}
        onChange={(v) => setSub(String(v))}
      />

      {/* Quest banner */}
      <Card
        padded={false}
        color={colorByCat[sub]}
        style={{ padding: "16px 20px", color: "white" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "var(--mono)",
                fontSize: 10,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                fontWeight: 700,
                opacity: 0.8,
              }}
            >
              {labelByCat[sub]}
            </div>
            <div
              style={{
                fontFamily: "var(--display)",
                fontSize: 28,
                fontWeight: 700,
                letterSpacing: "-0.02em",
                marginTop: 2,
              }}
            >
              {activeGoals.length} open
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 4,
            }}
          >
            <span
              style={{
                fontFamily: "var(--mono)",
                fontSize: 10,
                letterSpacing: "0.1em",
                opacity: 0.8,
                fontWeight: 600,
              }}
            >
              {sub === "Side" ? "STAKE" : "STAKE EACH"}
            </span>
            <span
              style={{
                fontFamily: "var(--display)",
                fontSize: 22,
                fontWeight: 700,
              }}
            >
              {sub === "Side" ? "no $" : `$${stakeByCat[sub]}`}
            </span>
          </div>
        </div>
        {sub === "Side" && (
          <div
            style={{
              marginTop: 12,
              fontFamily: "var(--body)",
              fontSize: 13,
              color: "rgba(255,255,255,0.95)",
              fontWeight: 500,
              fontStyle: "italic",
              lineHeight: 1.4,
            }}
          >
            For your own — not the pact. No stake, no shame.
          </div>
        )}
      </Card>

      <Card padded={false} style={{ padding: "8px 22px" }}>
        {activeGoals.map((g, i) => (
          <div
            key={g.id}
            style={{
              padding: "16px 0",
              borderTop: i > 0 ? "2px solid rgba(27,17,64,0.08)" : "none",
            }}
          >
            <GoalRow
              goal={g}
              dispatch={dispatch}
              tasks={state.tasks.filter((t) => t.goalId === g.id)}
              hideStake={g.category === "Side"}
              onAddTask={() => openSheet("addTask", { goalId: g.id })}
              onDelete={() => {
                if (
                  window.confirm(
                    `Delete "${g.title}"? Its tasks are removed too. This can't be undone.`
                  )
                )
                  dispatch({ type: "DELETE_GOAL", id: g.id });
              }}
            />
          </div>
        ))}
        {activeGoals.length === 0 && (
          <div style={{ padding: "32px 0", textAlign: "center" }}>
            <div
              style={{
                fontFamily: "var(--display)",
                fontSize: 22,
                fontWeight: 700,
                color: "var(--ink)",
                marginBottom: 6,
              }}
            >
              {sub === "Side"
                ? "Side quests are for you."
                : "Three quests max."}
            </div>
            <div
              style={{
                fontFamily: "var(--body)",
                fontSize: 14,
                color: "var(--ink-soft)",
              }}
            >
              {sub === "Side"
                ? "Books to read, plants to plant, things you keep meaning to do."
                : "Specific. Under 15 minutes each."}
            </div>
          </div>
        )}
      </Card>

      <Button
        variant={sub === "Side" ? "ghost" : "purple"}
        fullWidth
        size="lg"
        onClick={() => openSheet("addGoal", { category: sub as Goal["category"] })}
      >
        <Icon
          name="plus"
          size={18}
          strokeWidth={2.6}
          color={sub === "Side" ? "var(--ink)" : "white"}
        />{" "}
        New {sub} Quest
      </Button>

      {historyGoals.length > 0 && (
        <div>
          <Eyebrow style={{ marginBottom: 12, paddingLeft: 4 }}>
            Quest History · {historyGoals.length}
          </Eyebrow>
          <Card padded={false} style={{ padding: "8px 22px" }}>
            {historyGoals.map((g, i) => (
              <div
                key={g.id}
                style={{
                  padding: "16px 0",
                  borderTop:
                    i > 0 ? "2px solid rgba(27,17,64,0.08)" : "none",
                }}
              >
                <GoalRow
                  goal={g}
                  dispatch={dispatch}
                  tasks={state.tasks.filter((t) => t.goalId === g.id)}
                  hideStake={g.category === "Side"}
                  onDelete={() => {
                    if (
                      window.confirm(
                        `Delete "${g.title}"? Its tasks are removed too. This can't be undone.`
                      )
                    )
                      dispatch({ type: "DELETE_GOAL", id: g.id });
                  }}
                />
              </div>
            ))}
          </Card>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Hidden page (reached by tapping the home greeting 5×). A stash of quests
// that are parked — never shown in active lists, never auto-failed — until
// pushed into a real spot.
export const FutureQuestsTab = ({
  state,
  dispatch,
  openSheet,
}: {
  state: State;
  dispatch: Dispatch;
  openSheet: OpenSheet;
}) => {
  const spots: Goal["category"][] = [
    "Weekly",
    "Monthly",
    "Quarterly",
    "Side",
  ];
  const colorByCat: Record<string, string> = {
    Weekly: "var(--accent)",
    Monthly: "var(--purple)",
    Quarterly: "var(--magenta)",
    Side: "var(--teal)",
  };
  const quests = [...state.futureGoals].sort((a, b) => a.sort - b.sort);
  const urgesTotal =
    state.urgesSkipped +
    state.wants.filter((w) => w.decision === "skip").length;

  const overrides: {
    key: string;
    label: string;
    value: string;
    action: string;
    onClick: () => void;
    variant: "purple" | "danger";
  }[] = [
    {
      key: "streak",
      label: "Streak",
      value: `${state.streak} ${state.streak === 1 ? "wk" : "wks"}`,
      action: "Edit",
      onClick: () => openSheet("editStreak"),
      variant: "purple",
    },
    {
      key: "saved",
      label: "Saved from anti-charity",
      value: `$${state.saved.toLocaleString()}`,
      action: "Edit",
      onClick: () => openSheet("editSaved"),
      variant: "purple",
    },
    {
      key: "urges",
      label: "Urges skipped",
      value: String(urgesTotal),
      action: "Reset",
      onClick: () => {
        if (
          window.confirm(
            "Reset urges skipped to 0 and erase want history? This can't be undone."
          )
        )
          dispatch({ type: "RESET_URGES" });
      },
      variant: "danger",
    },
    {
      key: "budget",
      label: "Spending max",
      value: `$${state.weeklyBudget.toLocaleString()}`,
      action: "Edit",
      onClick: () => openSheet("editBudget"),
      variant: "purple",
    },
  ];

  return (
    <div
      style={{
        padding: "8px 20px 24px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <button
        onClick={() => dispatch({ type: "TAB", tab: "today" })}
        style={{
          alignSelf: "flex-start",
          display: "flex",
          alignItems: "center",
          gap: 6,
          background: "transparent",
          border: "none",
          cursor: "pointer",
          padding: 0,
          fontFamily: "var(--mono)",
          fontSize: 11,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          fontWeight: 700,
          color: "var(--ink-soft)",
        }}
      >
        <span style={{ fontSize: 14 }}>&larr;</span> Back home
      </button>

      <Card
        padded={false}
        color="var(--ink)"
        style={{ padding: "16px 20px", color: "white" }}
      >
        <div
          style={{
            fontFamily: "var(--mono)",
            fontSize: 10,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            fontWeight: 700,
            opacity: 0.8,
          }}
        >
          The Stash · {quests.length}
        </div>
        <div
          style={{
            fontFamily: "var(--body)",
            fontSize: 13,
            color: "rgba(255,255,255,0.95)",
            fontWeight: 500,
            lineHeight: 1.45,
            marginTop: 8,
          }}
        >
          Park ideas here. They never count against you and never auto-fail —
          push one into a spot when you're ready to play it.
        </div>
      </Card>

      <Card padded={false} style={{ padding: "8px 22px" }}>
        <div
          style={{
            fontFamily: "var(--mono)",
            fontSize: 10,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            fontWeight: 700,
            color: "var(--ink-soft)",
            padding: "14px 0 2px",
          }}
        >
          Manual overrides
        </div>
        {overrides.map((o, i) => (
          <div
            key={o.key}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              padding: "14px 0",
              borderTop: i > 0 ? "2px solid rgba(27,17,64,0.08)" : "none",
            }}
          >
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontFamily: "var(--body)",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "var(--ink)",
                }}
              >
                {o.label}
              </div>
              <div
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "var(--ink-soft)",
                  marginTop: 2,
                }}
              >
                {o.value}
              </div>
            </div>
            <Button
              variant={o.variant}
              size="sm"
              onClick={o.onClick}
              style={{ flexShrink: 0 }}
            >
              {o.action}
            </Button>
          </div>
        ))}
      </Card>

      <Card padded={false} style={{ padding: "8px 22px" }}>
        {quests.map((g, i) => (
          <div
            key={g.id}
            style={{
              padding: "16px 0",
              borderTop: i > 0 ? "2px solid rgba(27,17,64,0.08)" : "none",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 12,
              }}
            >
              <div
                style={{
                  fontFamily: "var(--display)",
                  fontSize: 16,
                  fontWeight: 700,
                  color: "var(--ink)",
                  lineHeight: 1.25,
                }}
              >
                {g.title}
              </div>
              <button
                onClick={() => {
                  if (
                    window.confirm(
                      `Delete "${g.title}" from the stash? This can't be undone.`
                    )
                  )
                    dispatch({ type: "DELETE_FUTURE_GOAL", id: g.id });
                }}
                aria-label="Delete"
                style={{
                  flexShrink: 0,
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: 4,
                  color: "var(--ink-soft)",
                }}
              >
                <Icon name="x" size={14} strokeWidth={2.6} color="var(--red)" />
              </button>
            </div>
            {g.stake > 0 && (
              <div
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "var(--ink-soft)",
                  marginTop: 4,
                }}
              >
                ${g.stake} stake
              </div>
            )}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 6,
                marginTop: 12,
              }}
            >
              {spots.map((cat) => (
                <button
                  key={cat}
                  onClick={() =>
                    dispatch({
                      type: "PUSH_FUTURE_GOAL",
                      id: g.id,
                      category: cat,
                    })
                  }
                  style={{
                    height: 38,
                    borderRadius: 9,
                    cursor: "pointer",
                    background: colorByCat[cat],
                    color: "white",
                    border: "2px solid var(--ink)",
                    boxShadow: "2px 2px 0 var(--ink)",
                    fontFamily: "var(--body)",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.02em",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        ))}
        {quests.length === 0 && (
          <div style={{ padding: "32px 0", textAlign: "center" }}>
            <div
              style={{
                fontFamily: "var(--display)",
                fontSize: 22,
                fontWeight: 700,
                color: "var(--ink)",
                marginBottom: 6,
              }}
            >
              Nothing stashed yet.
            </div>
            <div
              style={{
                fontFamily: "var(--body)",
                fontSize: 14,
                color: "var(--ink-soft)",
              }}
            >
              Ideas you're not ready to commit to. Safe here.
            </div>
          </div>
        )}
      </Card>

      <Button
        variant="purple"
        fullWidth
        size="lg"
        onClick={() => openSheet("addFutureGoal")}
      >
        <Icon name="plus" size={18} strokeWidth={2.6} color="white" /> Stash a
        future quest
      </Button>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
export const WantsTab = ({
  state,
  dispatch,
  openSheet,
  now,
}: {
  state: State;
  dispatch: Dispatch;
  openSheet: OpenSheet;
  now: number;
}) => {
  const pending = state.wants.filter((w) => !w.decision);
  const decided = state.wants.filter((w) => w.decision);
  const skipped = state.wants.filter((w) => w.decision === "skip").length;
  const total = state.urgesSkipped + skipped;

  return (
    <div
      style={{
        padding: "8px 20px 24px",
        display: "flex",
        flexDirection: "column",
        gap: 18,
      }}
    >
      {/* Skipped counter — big trophy hero */}
      <Card
        padded={false}
        color="var(--magenta)"
        style={{
          padding: "26px 22px",
          textAlign: "center",
          color: "white",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{ position: "absolute", top: 14, left: 16, opacity: 0.4 }}
        >
          <Icon name="sparkle" size={16} />
        </div>
        <button
          onClick={() => {
            if (
              window.confirm(
                "Reset urges skipped to 0 and erase want history? This can't be undone."
              )
            )
              dispatch({ type: "RESET_URGES" });
          }}
          aria-label="Reset urges skipped and erase history"
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            zIndex: 2,
            background: "rgba(255,255,255,0.18)",
            border: "1.5px solid rgba(255,255,255,0.55)",
            color: "white",
            borderRadius: 999,
            padding: "5px 12px",
            fontFamily: "var(--mono)",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.08em",
            cursor: "pointer",
          }}
        >
          RESET
        </button>
        <div
          style={{ position: "absolute", bottom: 18, right: 18, opacity: 0.4 }}
        >
          <Icon name="sparkle" size={14} />
        </div>

        <Eyebrow
          style={{
            color: "rgba(255,255,255,0.85)",
            letterSpacing: "0.18em",
            fontWeight: 700,
          }}
        >
          URGES SKIPPED
        </Eyebrow>
        <div style={{ marginTop: 10, marginBottom: 4 }}>
          <span
            style={{
              fontFamily: "var(--display)",
              fontSize: 96,
              fontWeight: 800,
              letterSpacing: "-0.04em",
              color: "white",
              textShadow: "4px 4px 0 #B01A6E",
              lineHeight: 0.9,
            }}
          >
            {total}
          </span>
        </div>
        <div
          style={{
            fontFamily: "var(--body)",
            fontSize: 14,
            color: "rgba(255,255,255,0.95)",
            fontWeight: 500,
            fontStyle: "italic",
            marginTop: 8,
          }}
        >
          Wins you got to spend somewhere else.
        </div>
      </Card>

      <Button
        variant="lime"
        fullWidth
        size="lg"
        onClick={() => openSheet("addWant")}
      >
        <Icon name="plus" size={18} strokeWidth={2.6} color="var(--ink)" /> ADD
        AN URGE
      </Button>

      {/* Waiting it out */}
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 12,
            paddingLeft: 4,
          }}
        >
          <Icon name="timer" size={16} color="var(--ink)" strokeWidth={2.4} />
          <Eyebrow>Waiting it out · {pending.length}</Eyebrow>
        </div>
        <Card
          padded={false}
          style={{ padding: pending.length === 0 ? 24 : "8px 22px" }}
        >
          {pending.length === 0 && (
            <div style={{ textAlign: "center", padding: "12px 8px" }}>
              <div
                style={{
                  fontFamily: "var(--display)",
                  fontSize: 20,
                  fontWeight: 700,
                  color: "var(--ink)",
                  marginBottom: 8,
                  lineHeight: 1.35,
                }}
              >
                When you feel the urge, log it here.
              </div>
              <div
                style={{
                  fontFamily: "var(--body)",
                  fontSize: 13,
                  color: "var(--ink-soft)",
                  lineHeight: 1.5,
                }}
              >
                Wait 24 hours. The urge fades.
              </div>
            </div>
          )}
          {pending.map((w, i) => (
            <WantRow
              key={w.id}
              want={w}
              now={now}
              dispatch={dispatch}
              first={i === 0}
            />
          ))}
        </Card>
      </div>

      {/* History */}
      {decided.length > 0 && (
        <div>
          <Eyebrow style={{ marginBottom: 12, paddingLeft: 4 }}>
            History
          </Eyebrow>
          <Card padded={false} style={{ padding: "8px 22px" }}>
            {decided.map((w, i) => (
              <div
                key={w.id}
                style={{
                  padding: "14px 0",
                  borderTop:
                    i > 0 ? "2px solid rgba(27,17,64,0.08)" : "none",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 500,
                      color:
                        w.decision === "skip"
                          ? "var(--ink-soft)"
                          : "var(--ink)",
                      textDecoration:
                        w.decision === "skip" ? "line-through" : "none",
                    }}
                  >
                    {w.title}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: 11,
                      color: "var(--ink-soft)",
                      marginTop: 3,
                      fontWeight: 500,
                    }}
                  >
                    {w.price ? <>${w.price} · </> : null}
                    {w.dateLabel}
                  </div>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: 10 }}
                >
                  <Pill tone={w.decision === "skip" ? "pass" : "neutral"}>
                    {w.decision === "skip" ? "SKIPPED ✓" : "BOUGHT"}
                  </Pill>
                  <button
                    onClick={() =>
                      dispatch({ type: "DELETE_WANT", id: w.id })
                    }
                    aria-label={`Delete ${w.title}`}
                    style={{
                      flexShrink: 0,
                      width: 24,
                      height: 24,
                      borderRadius: 7,
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--ink-soft)",
                      opacity: 0.5,
                      padding: 0,
                    }}
                  >
                    <Icon name="x" size={13} strokeWidth={2.4} />
                  </button>
                </div>
              </div>
            ))}
          </Card>
        </div>
      )}
    </div>
  );
};

const WantRow = ({
  want,
  now,
  dispatch,
  first,
}: {
  want: Want;
  now: number;
  dispatch: Dispatch;
  first: boolean;
}) => {
  const ms = want.expiresAt - now;
  const total = want.expiresAt - want.addedAt;
  const elapsed = total - ms;
  const ready = ms <= 0;
  return (
    <div
      style={{
        padding: "16px 0",
        borderTop: first ? "none" : "2px solid rgba(27,17,64,0.08)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 10,
        }}
      >
        <div style={{ fontSize: 15, color: "var(--ink)", fontWeight: 600 }}>
          {want.title}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {want.price != null && (
            <Money
              amount={want.price}
              size={14}
              weight={600}
              color="var(--ink-soft)"
            />
          )}
          <button
            onClick={() => dispatch({ type: "DELETE_WANT", id: want.id })}
            aria-label={`Delete ${want.title}`}
            style={{
              flexShrink: 0,
              width: 24,
              height: 24,
              borderRadius: 7,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--ink-soft)",
              opacity: 0.5,
              padding: 0,
            }}
          >
            <Icon name="x" size={13} strokeWidth={2.4} />
          </button>
        </div>
      </div>
      <div style={{ marginBottom: 10 }}>
        <ProgressBar
          value={elapsed}
          max={total}
          color={ready ? "var(--green)" : "var(--accent)"}
          height={12}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          style={{
            fontFamily: "var(--mono)",
            fontSize: 12,
            color: ready ? "var(--green)" : "var(--ink-soft)",
            letterSpacing: "0.04em",
            fontWeight: 700,
            textTransform: "uppercase",
          }}
        >
          {ready ? "✓ DECIDE NOW" : formatCountdown(want.expiresAt, now)}
        </div>
        {ready ? (
          <div style={{ display: "flex", gap: 6 }}>
            <Button
              size="sm"
              variant="pass"
              onClick={() =>
                dispatch({
                  type: "DECIDE_WANT",
                  id: want.id,
                  decision: "skip",
                })
              }
            >
              Skip it!
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() =>
                dispatch({
                  type: "DECIDE_WANT",
                  id: want.id,
                  decision: "buy",
                })
              }
            >
              Still want it
            </Button>
          </div>
        ) : (
          <div
            style={{
              fontFamily: "var(--mono)",
              fontSize: 11,
              color: "var(--ink-soft)",
              fontWeight: 500,
            }}
          >
            added {want.addedLabel}
          </div>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
export const SpendTab = ({
  state,
  dispatch,
  openSheet,
}: {
  state: State;
  dispatch: Dispatch;
  openSheet: OpenSheet;
}) => {
  const weekTx = state.spending.filter(
    (s) => s.weekStart === state.currentWeek
  );
  const total = weekTx.reduce((a, b) => a + b.amount, 0);
  const pct = total / state.weeklyBudget;
  const barColor =
    pct > 1 ? "var(--red)" : pct > 0.8 ? "var(--gold)" : "var(--teal)";
  const heroBg =
    pct > 1
      ? "var(--red-soft)"
      : pct > 0.8
      ? "var(--gold-soft)"
      : "var(--teal-soft)";

  return (
    <div
      style={{
        padding: "8px 20px 24px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <Card padded={false} color={heroBg} style={{ padding: "24px 22px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <Eyebrow>Week of {state.currentWeekLabel}</Eyebrow>
          <button
            onClick={() => openSheet("editBudget")}
            aria-label="Edit weekly budget"
            style={{
              background: "white",
              border: "2px solid var(--ink)",
              borderRadius: 999,
              padding: "4px 10px",
              fontFamily: "var(--mono)",
              fontSize: 10,
              fontWeight: 700,
              cursor: "pointer",
              letterSpacing: "0.04em",
            }}
          >
            EDIT
          </button>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 6,
            marginBottom: 16,
          }}
        >
          <span
            style={{
              fontFamily: "var(--display)",
              fontSize: 60,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: "var(--ink)",
              fontVariantNumeric: "tabular-nums",
              lineHeight: 0.95,
            }}
          >
            ${total.toFixed(2)}
          </span>
          <span
            style={{
              fontFamily: "var(--mono)",
              fontSize: 16,
              color: "var(--ink-soft)",
              fontWeight: 600,
            }}
          >
            /${state.weeklyBudget}
          </span>
        </div>
        <ProgressBar
          value={total}
          max={state.weeklyBudget}
          color={barColor}
          height={14}
        />
        <div
          style={{
            marginTop: 12,
            fontFamily: "var(--mono)",
            fontSize: 12,
            color: "var(--ink)",
            letterSpacing: "0.04em",
            fontWeight: 700,
            textTransform: "uppercase",
          }}
        >
          {pct > 1
            ? `🔥 ${Math.round((pct - 1) * 100)}% OVER`
            : `${(state.weeklyBudget - total).toFixed(2)} LEFT`}
        </div>
      </Card>

      <Button
        variant="lime"
        fullWidth
        size="lg"
        onClick={() => openSheet("logSpend")}
      >
        <Icon name="plus" size={18} strokeWidth={2.6} color="var(--ink)" /> Log
        a purchase
      </Button>

      <div>
        <Eyebrow style={{ marginBottom: 12, paddingLeft: 4 }}>
          This week · {weekTx.length}
        </Eyebrow>
        <Card padded={false} style={{ padding: "4px 22px" }}>
          {weekTx.length === 0 && (
            <div
              style={{
                padding: "20px 0",
                textAlign: "center",
                fontFamily: "var(--body)",
                fontSize: 13,
                color: "var(--ink-soft)",
              }}
            >
              No purchases logged.
            </div>
          )}
          {weekTx.map((tx, i) => (
            <div
              key={tx.id}
              style={{
                padding: "16px 0",
                borderTop:
                  i > 0 ? "2px solid rgba(27,17,64,0.08)" : "none",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: "var(--ink)",
                  }}
                >
                  {tx.note || tx.category || "Purchase"}
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    alignItems: "center",
                    marginTop: 6,
                  }}
                >
                  {tx.category && (
                    <Pill
                      tone={
                        tx.category === "Online"
                          ? "accent"
                          : tx.category === "Clothes"
                          ? "magenta"
                          : tx.category === "Dining"
                          ? "gold"
                          : tx.category === "Beauty"
                          ? "purple"
                          : tx.category === "Hobbies"
                          ? "teal"
                          : "neutral"
                      }
                    >
                      {tx.category}
                    </Pill>
                  )}
                  <span
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: 11,
                      color: "var(--ink-soft)",
                      fontWeight: 600,
                    }}
                  >
                    {tx.dayLabel}
                  </span>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Money amount={tx.amount} size={18} weight={700} />
                <button
                  onClick={() =>
                    dispatch({ type: "DELETE_SPEND", id: tx.id })
                  }
                  aria-label={`Delete purchase: ${
                    tx.note || tx.category || "Purchase"
                  }`}
                  style={{
                    flexShrink: 0,
                    width: 24,
                    height: 24,
                    borderRadius: 7,
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--ink-soft)",
                    opacity: 0.5,
                    padding: 0,
                  }}
                >
                  <Icon name="x" size={13} strokeWidth={2.4} />
                </button>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
export const PactTab = ({
  state,
  openSheet,
}: {
  state: State;
  dispatch: Dispatch;
  openSheet: OpenSheet;
}) => {
  const owed = state.goals
    .filter((g) => g.status === "Fail" && !g.paid)
    .reduce((a, b) => a + Number(b.stake), 0);
  const [agreementOpen, setAgreementOpen] = useState(false);

  return (
    <div
      style={{
        padding: "8px 20px 24px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      {/* Owed hero */}
      <Card
        padded={false}
        color={owed > 0 ? "var(--red)" : "var(--green)"}
        style={{
          padding: "24px 22px",
          color: "white",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -8,
            right: -8,
            opacity: 0.15,
            transform: "rotate(15deg)",
          }}
        >
          <span style={{ fontSize: 80 }}>{owed > 0 ? "⚠️" : "✓"}</span>
        </div>
        <Eyebrow
          style={{ color: "rgba(255,255,255,0.85)", fontWeight: 700 }}
        >
          {owed > 0 ? "Owed to anti-charity" : "Status"}
        </Eyebrow>
        <div style={{ marginTop: 8, marginBottom: 8 }}>
          {owed > 0 ? (
            <span
              style={{
                fontFamily: "var(--display)",
                fontSize: 64,
                fontWeight: 700,
                letterSpacing: "-0.035em",
                color: "white",
                fontVariantNumeric: "tabular-nums",
                textShadow: "3px 3px 0 #A82A2A",
              }}
            >
              ${owed}
            </span>
          ) : (
            <span
              style={{
                fontFamily: "var(--display)",
                fontSize: 56,
                fontWeight: 700,
                letterSpacing: "-0.025em",
                color: "white",
                textShadow: "3px 3px 0 #1FA046",
              }}
            >
              All clear
            </span>
          )}
        </div>
        {owed > 0 && (
          <div
            style={{
              fontFamily: "var(--body)",
              fontSize: 14,
              color: "rgba(255,255,255,0.95)",
              fontWeight: 500,
              marginBottom: 16,
            }}
          >
            Pay it within 3 days. Don't carry it.
          </div>
        )}
        {owed > 0 && (
          <Button
            variant="ghost"
            fullWidth
            onClick={() => openSheet("logPayment", { amount: owed })}
          >
            Log payment
          </Button>
        )}
      </Card>

      {/* Saved counter */}
      <Card
        padded={false}
        color="var(--gold-soft)"
        style={{ padding: "20px 22px" }}
      >
        <Eyebrow>Total saved</Eyebrow>
        <div
          style={{
            marginTop: 6,
            display: "flex",
            alignItems: "baseline",
            gap: 10,
          }}
        >
          <span
            style={{
              fontFamily: "var(--display)",
              fontSize: 44,
              fontWeight: 700,
              letterSpacing: "-0.025em",
            }}
          >
            ${state.saved.toLocaleString()}
          </span>
          <span
            style={{
              fontFamily: "var(--mono)",
              fontSize: 11,
              color: "var(--ink-soft)",
              fontWeight: 700,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            across {state.streak} locked weeks 🔥
          </span>
        </div>
      </Card>

      {/* Agreement */}
      <Card padded={false}>
        <button
          onClick={() => setAgreementOpen((o) => !o)}
          style={{
            width: "100%",
            padding: "20px 22px",
            background: "transparent",
            border: "none",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
            fontFamily: "var(--display)",
            fontSize: 20,
            fontWeight: 700,
            color: "var(--ink)",
            letterSpacing: "-0.01em",
          }}
        >
          🤝 The Agreement
          <Icon
            name="chevronDown"
            size={20}
            color="var(--ink)"
            strokeWidth={2.4}
            style={{
              transform: agreementOpen ? "rotate(180deg)" : "rotate(0)",
              transition: "transform 200ms",
            }}
          />
        </button>
        {agreementOpen && (
          <div
            style={{
              padding: "0 22px 22px",
              fontFamily: "var(--body)",
              fontSize: 14,
              color: "var(--ink-soft)",
              lineHeight: 1.6,
            }}
          >
            <Divider style={{ marginBottom: 16 }} />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
                marginBottom: 16,
              }}
            >
              <div>
                <Eyebrow>Participant</Eyebrow>
                <div
                  style={{
                    marginTop: 4,
                    color: "var(--ink)",
                    fontWeight: 600,
                  }}
                >
                  Maribett
                </div>
              </div>
              <div>
                <Eyebrow>Partner</Eyebrow>
                <div
                  style={{
                    marginTop: 4,
                    color: "var(--ink)",
                    fontWeight: 600,
                  }}
                >
                  Justin Wai
                </div>
              </div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <Eyebrow>Anti-charity</Eyebrow>
              <div
                style={{
                  marginTop: 4,
                  color: "var(--ink)",
                  fontWeight: 600,
                }}
              >
                Any Trump-associated charity
              </div>
            </div>
            <Divider style={{ margin: "16px 0" }} />
            <div
              style={{
                marginBottom: 8,
                color: "var(--ink)",
                fontWeight: 700,
              }}
            >
              How it works
            </div>
            <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.7 }}>
              <li>Goals are binary — pass or fail.</li>
              <li>Missed stakes go to anti-charity within 3 days.</li>
              <li>Proof goes to the Partner.</li>
            </ul>
            <div
              style={{
                marginTop: 16,
                marginBottom: 8,
                color: "var(--ink)",
                fontWeight: 700,
              }}
            >
              Stakes
            </div>
            <ul
              style={{
                margin: 0,
                paddingLeft: 18,
                lineHeight: 1.7,
                fontFamily: "var(--mono)",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              <li>$50 weekly · $100 monthly · $150 quarterly</li>
            </ul>
          </div>
        )}
      </Card>

      {/* Payment history */}
      {state.payments.length > 0 && (
        <div>
          <Eyebrow style={{ marginBottom: 12, paddingLeft: 4 }}>
            Payment history
          </Eyebrow>
          <Card padded={false} style={{ padding: "4px 22px" }}>
            {state.payments.map((p, i) => (
              <div
                key={p.id}
                style={{
                  padding: "16px 0",
                  borderTop:
                    i > 0 ? "2px solid rgba(27,17,64,0.08)" : "none",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <Money amount={p.amount} size={16} weight={700} />
                  <div
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: 11,
                      color: "var(--ink-soft)",
                      marginTop: 4,
                      fontWeight: 600,
                    }}
                  >
                    {p.dateLabel}
                    {p.note ? ` · ${p.note}` : ""}
                  </div>
                </div>
                {p.proofUrl && <Pill tone="sky">PROOF</Pill>}
              </div>
            ))}
          </Card>
        </div>
      )}

      <Button variant="ghost" fullWidth>
        <Icon name="download" size={15} /> Export this month
      </Button>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// TASKS TAB — checklist of micro-steps linked to a parent quest

const CATEGORY_META: Record<
  string,
  { color: string; label: string; icon: string }
> = {
  Weekly: { color: "var(--accent)", label: "Weekly", icon: "target" },
  Monthly: { color: "var(--purple)", label: "Monthly", icon: "shield" },
  Quarterly: { color: "var(--magenta)", label: "Quarterly", icon: "trophy" },
  Side: { color: "var(--teal)", label: "Side", icon: "feather" },
};

export const TasksTab = ({
  state,
  dispatch,
  openSheet,
}: {
  state: State;
  dispatch: Dispatch;
  openSheet: OpenSheet;
}) => {
  const [filter, setFilter] = useState<string>("All");
  const allTasks = state.tasks;
  const totalDone = allTasks.filter((t) => t.done).length;
  const totalOpen = allTasks.length - totalDone;
  const totalMinutes = allTasks
    .filter((t) => !t.done)
    .reduce((a, t) => a + (t.minutes || 0), 0);

  const groupedGoals = state.goals
    .filter((g) => filter === "All" || g.category === filter)
    .map((g) => ({
      goal: g,
      tasks: state.tasks.filter((t) => t.goalId === g.id),
    }))
    .filter((group) => group.tasks.length > 0);

  return (
    <div
      style={{
        padding: "8px 20px 24px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      {/* Hero — total progress */}
      <Card
        padded={false}
        color="var(--lime)"
        style={{
          padding: "20px 22px",
          color: "var(--ink)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{ position: "absolute", top: 14, right: 16, opacity: 0.4 }}
        >
          <Icon name="checkSquare" size={20} />
        </div>
        <Eyebrow
          style={{ color: "var(--ink)", fontWeight: 700, opacity: 0.7 }}
        >
          STEPS TO BREAK QUESTS DOWN
        </Eyebrow>
        <div
          style={{
            marginTop: 8,
            display: "flex",
            alignItems: "baseline",
            gap: 8,
            marginBottom: 14,
          }}
        >
          <span
            style={{
              fontFamily: "var(--display)",
              fontSize: 56,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "var(--ink)",
              lineHeight: 0.9,
              textShadow: "3px 3px 0 var(--lime-deep)",
            }}
          >
            {totalOpen}
          </span>
          <span
            style={{
              fontFamily: "var(--mono)",
              fontSize: 13,
              fontWeight: 700,
              opacity: 0.75,
            }}
          >
            open / {totalDone} done
          </span>
        </div>
        <ProgressBar
          value={totalDone}
          max={Math.max(allTasks.length, 1)}
          color="var(--ink)"
          height={10}
        />
        {totalMinutes > 0 && (
          <div
            style={{
              marginTop: 10,
              fontFamily: "var(--mono)",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.05em",
              color: "var(--ink)",
              opacity: 0.8,
            }}
          >
            ~{totalMinutes} MIN OF WORK LEFT · UNDER 15 EACH
          </div>
        )}
      </Card>

      {/* Filter */}
      <SegmentedControl
        options={["All", "Weekly", "Monthly", "Quarterly", "Side"]}
        value={filter}
        onChange={(v) => setFilter(String(v))}
      />

      {/* Add task button */}
      <Button
        variant="lime"
        fullWidth
        size="lg"
        onClick={() => openSheet("addTask", {})}
      >
        <Icon name="plus" size={18} strokeWidth={2.6} color="var(--ink)" /> Add
        a task
      </Button>

      {/* Grouped tasks */}
      {groupedGoals.length === 0 && (
        <Card
          padded={false}
          style={{ padding: "32px 20px", textAlign: "center" }}
        >
          <div
            style={{
              fontFamily: "var(--display)",
              fontSize: 22,
              fontWeight: 700,
              color: "var(--ink)",
              marginBottom: 6,
            }}
          >
            No tasks yet.
          </div>
          <div
            style={{
              fontFamily: "var(--body)",
              fontSize: 13,
              color: "var(--ink-soft)",
              lineHeight: 1.5,
            }}
          >
            Big quests are scary. Tiny steps aren't.
          </div>
        </Card>
      )}

      {groupedGoals.map(({ goal, tasks }) => {
        const meta = CATEGORY_META[goal.category];
        const done = tasks.filter((t) => t.done).length;
        return (
          <Card
            key={goal.id}
            padded={false}
            style={{ padding: 0, overflow: "hidden" }}
          >
            {/* Quest header bar */}
            <div
              style={{
                background: meta.color,
                padding: "12px 18px",
                color: "white",
                borderBottom: "2px solid var(--ink)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 12,
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: 9.5,
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      fontWeight: 700,
                      opacity: 0.85,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <Icon name={meta.icon} size={11} strokeWidth={2.4} />
                    {meta.label} Quest
                    {goal.category !== "Side" && ` · $${goal.stake}`}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--display)",
                      fontSize: 18,
                      fontWeight: 700,
                      letterSpacing: "-0.015em",
                      marginTop: 3,
                      lineHeight: 1.25,
                    }}
                  >
                    {goal.title}
                  </div>
                </div>
                <div
                  style={{
                    background: "white",
                    color: "var(--ink)",
                    border: "2px solid var(--ink)",
                    borderRadius: 999,
                    padding: "3px 10px",
                    fontFamily: "var(--mono)",
                    fontSize: 11,
                    fontWeight: 800,
                    whiteSpace: "nowrap",
                  }}
                >
                  {done}/{tasks.length}
                </div>
              </div>
            </div>
            {/* Task rows */}
            <div style={{ padding: "4px 18px" }}>
              {tasks.map((t, i) => (
                <TaskRow
                  key={t.id}
                  task={t}
                  dispatch={dispatch}
                  first={i === 0}
                />
              ))}
              <div style={{ padding: "10px 0 14px" }}>
                <button
                  onClick={() => openSheet("addTask", { goalId: goal.id })}
                  style={{
                    background: "transparent",
                    border: "2px dashed var(--ink-soft)",
                    borderRadius: 10,
                    padding: "10px 14px",
                    cursor: "pointer",
                    fontFamily: "var(--mono)",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "var(--ink-soft)",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                  }}
                >
                  <Icon name="plus" size={13} strokeWidth={2.4} /> Add step to
                  this quest
                </button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

const TaskRow = ({
  task,
  dispatch,
  first,
}: {
  task: Task;
  dispatch: Dispatch;
  first: boolean;
}) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        padding: "14px 0",
        borderTop: first ? "none" : "2px solid rgba(27,17,64,0.08)",
      }}
    >
      <button
        onClick={() => dispatch({ type: "TOGGLE_TASK", id: task.id })}
        style={{
          flexShrink: 0,
          marginTop: 1,
          width: 28,
          height: 28,
          borderRadius: 8,
          background: task.done ? "var(--green)" : "white",
          border: "2px solid var(--ink)",
          boxShadow: task.done ? "none" : "2px 2px 0 var(--ink)",
          transform: task.done ? "translate(2px,2px)" : "translate(0,0)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition:
            "transform 0.06s, box-shadow 0.06s, background 0.18s",
        }}
        aria-label={task.done ? "Mark incomplete" : "Mark complete"}
      >
        {task.done && (
          <Icon name="check" size={16} color="white" strokeWidth={3} />
        )}
      </button>
      <div style={{ flex: 1, paddingTop: 2 }}>
        <InlineEditText
          value={task.title}
          ariaLabel="Edit task"
          onCommit={(title) =>
            dispatch({ type: "EDIT_TASK", id: task.id, title })
          }
          textStyle={{
            fontFamily: "var(--body)",
            fontSize: 14.5,
            lineHeight: 1.35,
            fontWeight: 500,
            color: task.done ? "var(--ink-soft)" : "var(--ink)",
            textDecoration: task.done ? "line-through" : "none",
            textDecorationThickness: "2px",
          }}
        />
        {task.minutes != null && (
          <div
            style={{
              marginTop: 4,
              fontFamily: "var(--mono)",
              fontSize: 10.5,
              fontWeight: 600,
              color: "var(--ink-soft)",
              letterSpacing: "0.04em",
            }}
          >
            ⏱ ~{task.minutes} MIN
          </div>
        )}
      </div>
      <button
        onClick={() => dispatch({ type: "DELETE_TASK", id: task.id })}
        style={{
          flexShrink: 0,
          marginTop: 1,
          width: 28,
          height: 28,
          borderRadius: 8,
          background: "transparent",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--ink-soft)",
          opacity: 0.5,
        }}
        aria-label="Delete task"
      >
        <Icon name="x" size={14} strokeWidth={2.4} />
      </button>
    </div>
  );
};
