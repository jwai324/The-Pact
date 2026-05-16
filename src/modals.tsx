// Modals (bottom sheets) for The Pact — gamified (ported from modals.jsx)
import { useState, useEffect } from "react";
import {
  Sheet,
  Field,
  Input,
  SegmentedControl,
  Button,
  Eyebrow,
  Icon,
  StreakFlame,
} from "./components/ui";
import type { Action, Category, Goal } from "./state/types";

type Dispatch = (a: Action) => void;

export const AddWantSheet = ({
  open,
  onClose,
  dispatch,
}: {
  open: boolean;
  onClose: () => void;
  dispatch: Dispatch;
}) => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState(24);
  useEffect(() => {
    if (open) {
      setTitle("");
      setPrice("");
      setDuration(24);
    }
  }, [open]);
  const submit = () => {
    if (!title.trim()) return;
    dispatch({
      type: "ADD_WANT",
      title: title.trim(),
      price: price ? Number(price) : null,
      hours: duration,
    });
    onClose();
  };
  return (
    <Sheet open={open} onClose={onClose} title="Tempted? 🛍️">
      <div
        style={{
          fontFamily: "var(--body)",
          fontSize: 14,
          color: "var(--ink-soft)",
          marginBottom: 22,
          lineHeight: 1.5,
          fontWeight: 500,
        }}
      >
        Drop it in. Let it wait. Most urges fade.
      </div>
      <Field label="What do you want?">
        <Input
          value={title}
          onChange={setTitle}
          placeholder="e.g. wireless earbuds"
        />
      </Field>
      <Field label="Price (optional)">
        <Input
          value={price}
          onChange={setPrice}
          prefix="$"
          inputMode="decimal"
          placeholder="0"
        />
      </Field>
      <Field label="Wait it out for">
        <SegmentedControl
          options={[
            { value: 6, label: "6 hours" },
            { value: 24, label: "24 hours" },
            { value: 72, label: "3 days" },
          ]}
          value={duration}
          onChange={(v) => setDuration(Number(v))}
        />
      </Field>
      <Button
        variant="accent"
        fullWidth
        size="lg"
        onClick={submit}
        style={{ marginTop: 8 }}
      >
        Lock the urge
      </Button>
    </Sheet>
  );
};

export const AddGoalSheet = ({
  open,
  onClose,
  dispatch,
  defaultCategory = "Weekly",
}: {
  open: boolean;
  onClose: () => void;
  dispatch: Dispatch;
  defaultCategory?: Category;
}) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Category>(defaultCategory);
  const [stake, setStake] = useState(50);
  useEffect(() => {
    if (open) {
      setTitle("");
      setCategory(defaultCategory);
      setStake(
        defaultCategory === "Weekly"
          ? 50
          : defaultCategory === "Monthly"
          ? 100
          : 150
      );
    }
  }, [open, defaultCategory]);
  useEffect(() => {
    setStake(
      category === "Weekly" ? 50 : category === "Monthly" ? 100 : 150
    );
  }, [category]);
  const submit = () => {
    if (!title.trim()) return;
    dispatch({ type: "ADD_GOAL", title: title.trim(), category, stake });
    onClose();
  };
  return (
    <Sheet open={open} onClose={onClose} title="New Quest 🎯">
      <div
        style={{
          fontFamily: "var(--body)",
          fontSize: 14,
          color: "var(--ink-soft)",
          marginBottom: 22,
          lineHeight: 1.5,
          fontWeight: 500,
        }}
      >
        Specific. Under 15 minutes.
      </div>
      <Field label="Quest">
        <Input
          value={title}
          onChange={setTitle}
          placeholder="e.g. Set up auto IRA"
        />
      </Field>
      <Field label="Category">
        <SegmentedControl
          options={["Weekly", "Monthly", "Quarterly"]}
          value={category}
          onChange={(v) => setCategory(v as Category)}
        />
      </Field>
      <Field label="Stake">
        <Input
          value={stake}
          onChange={(v) => setStake(Number(v) || 0)}
          prefix="$"
          inputMode="decimal"
        />
      </Field>
      <Button
        variant="purple"
        fullWidth
        size="lg"
        onClick={submit}
        style={{ marginTop: 8 }}
      >
        Accept quest
      </Button>
    </Sheet>
  );
};

export const LogSpendSheet = ({
  open,
  onClose,
  dispatch,
}: {
  open: boolean;
  onClose: () => void;
  dispatch: Dispatch;
}) => {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [category, setCategory] = useState("Online");
  useEffect(() => {
    if (open) {
      setAmount("");
      setNote("");
      setCategory("Online");
    }
  }, [open]);
  const submit = () => {
    if (!amount) return;
    dispatch({
      type: "LOG_SPEND",
      amount: Number(amount),
      note,
      category,
    });
    onClose();
  };
  const cats = [
    { name: "Online", color: "var(--accent)" },
    { name: "Clothes", color: "var(--magenta)" },
    { name: "Dining", color: "var(--gold)" },
    { name: "Beauty", color: "var(--purple)" },
    { name: "Hobbies", color: "var(--teal)" },
    { name: "Other", color: "var(--ink)" },
  ];
  return (
    <Sheet open={open} onClose={onClose} title="Log purchase">
      <Field label="Amount">
        <Input
          value={amount}
          onChange={setAmount}
          prefix="$"
          inputMode="decimal"
          placeholder="0.00"
        />
      </Field>
      <Field label="Category">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {cats.map((c) => (
            <button
              key={c.name}
              onClick={() => setCategory(c.name)}
              style={{
                padding: "10px 14px",
                borderRadius: 999,
                cursor: "pointer",
                background: category === c.name ? c.color : "white",
                color: category === c.name ? "white" : "var(--ink)",
                border: `2px solid var(--ink)`,
                boxShadow:
                  category === c.name ? "2px 2px 0 var(--ink)" : "none",
                fontFamily: "var(--body)",
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "0.02em",
              }}
            >
              {c.name}
            </button>
          ))}
        </div>
      </Field>
      <Field label="Note (optional)">
        <Input
          value={note}
          onChange={setNote}
          placeholder="e.g. Trader Joe's"
        />
      </Field>
      <Button
        variant="primary"
        fullWidth
        size="lg"
        onClick={submit}
        style={{ marginTop: 8 }}
      >
        Log it
      </Button>
    </Sheet>
  );
};

export const EditBudgetSheet = ({
  open,
  onClose,
  dispatch,
  current,
}: {
  open: boolean;
  onClose: () => void;
  dispatch: Dispatch;
  current: number;
}) => {
  const [amount, setAmount] = useState(String(current));
  useEffect(() => {
    if (open) setAmount(String(current));
  }, [open, current]);
  const submit = () => {
    const n = Number(amount);
    if (!amount || !Number.isFinite(n) || n <= 0) return;
    dispatch({ type: "SET_BUDGET", amount: n });
    onClose();
  };
  return (
    <Sheet open={open} onClose={onClose} title="Weekly budget">
      <Field label="How much can you spend each week?">
        <Input
          value={amount}
          onChange={setAmount}
          prefix="$"
          inputMode="decimal"
          placeholder="125"
        />
      </Field>
      <Button
        variant="primary"
        fullWidth
        size="lg"
        onClick={submit}
        style={{ marginTop: 8 }}
      >
        Save budget
      </Button>
    </Sheet>
  );
};

export const LogPaymentSheet = ({
  open,
  onClose,
  dispatch,
  suggestedAmount = 0,
}: {
  open: boolean;
  onClose: () => void;
  dispatch: Dispatch;
  suggestedAmount?: number;
}) => {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [proof, setProof] = useState("");
  useEffect(() => {
    if (open) {
      setAmount(String(suggestedAmount || ""));
      setNote("");
      setProof("");
    }
  }, [open, suggestedAmount]);
  const submit = () => {
    if (!amount) return;
    dispatch({
      type: "LOG_PAYMENT",
      amount: Number(amount),
      note,
      proofUrl: proof,
    });
    onClose();
  };
  return (
    <Sheet open={open} onClose={onClose} title="Log payment">
      <div
        style={{
          fontFamily: "var(--body)",
          fontSize: 14,
          color: "var(--ink-soft)",
          marginBottom: 22,
          lineHeight: 1.5,
          fontWeight: 500,
        }}
      >
        Donation to anti-charity. Send proof to Justin.
      </div>
      <Field label="Amount paid">
        <Input
          value={amount}
          onChange={setAmount}
          prefix="$"
          inputMode="decimal"
        />
      </Field>
      <Field label="Note (optional)">
        <Input
          value={note}
          onChange={setNote}
          placeholder="e.g. Missed monthly"
        />
      </Field>
      <Field label="Proof URL (optional)">
        <Input value={proof} onChange={setProof} placeholder="https://..." />
      </Field>
      <Button
        variant="danger"
        fullWidth
        size="lg"
        onClick={submit}
        style={{ marginTop: 8 }}
      >
        Mark as paid
      </Button>
    </Sheet>
  );
};

// Lock-In Week celebration — full-screen takeover, MAXIMUM JUICE
export const LockInOverlay = ({
  open,
  stakes,
  weeks,
  onClose,
}: {
  open: boolean;
  stakes: number;
  weeks: number;
  onClose: () => void;
}) => {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: 480,
        background:
          "linear-gradient(160deg, #7B5CFF 0%, #E63992 50%, #FF5A3C 100%)",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 32,
        opacity: open ? 1 : 0,
        pointerEvents: open ? "auto" : "none",
        transition: "opacity 280ms ease",
        overflow: "hidden",
      }}
    >
      {/* sparkles */}
      {open &&
        Array.from({ length: 14 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: `${10 + Math.random() * 80}%`,
              left: `${10 + Math.random() * 80}%`,
              opacity: 0.5 + Math.random() * 0.5,
              animation: `float ${2 + Math.random() * 2}s ease-in-out infinite ${
                Math.random() * 2
              }s`,
            }}
          >
            <Icon name="sparkle" size={10 + Math.random() * 18} />
          </div>
        ))}

      <div style={{ position: "absolute", top: 56, right: 20, zIndex: 5 }}>
        <button
          onClick={onClose}
          style={{
            width: 44,
            height: 44,
            borderRadius: 999,
            background: "rgba(255,255,255,0.15)",
            border: "2px solid white",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <Icon name="x" size={18} color="white" strokeWidth={2.6} />
        </button>
      </div>

      <div
        style={{
          fontFamily: "var(--mono)",
          fontSize: 12,
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          color: "white",
          marginBottom: 8,
          fontWeight: 700,
          animation: open ? "fadeUp 0.5s 0.05s both" : "none",
        }}
      >
        LEVEL UP
      </div>

      <div
        style={{
          fontFamily: "var(--display)",
          fontSize: 60,
          fontStyle: "italic",
          fontWeight: 700,
          color: "white",
          marginBottom: 28,
          letterSpacing: "-0.025em",
          textShadow: "4px 4px 0 rgba(0,0,0,0.2)",
          animation: open ? "pop 0.6s 0.15s both" : "none",
        }}
      >
        +1 Week
      </div>

      <div
        style={{
          background: "white",
          color: "var(--ink)",
          padding: "24px 32px",
          borderRadius: 24,
          border: "3px solid var(--ink)",
          boxShadow: "8px 8px 0 var(--ink)",
          textAlign: "center",
          marginBottom: 28,
          animation: open ? "pop 0.5s 0.4s both" : "none",
        }}
      >
        <Eyebrow>Money you didn't lose</Eyebrow>
        <div
          style={{
            fontFamily: "var(--display)",
            fontSize: 88,
            fontWeight: 800,
            letterSpacing: "-0.04em",
            color: "var(--green)",
            lineHeight: 0.95,
            textShadow: "4px 4px 0 #1FA046",
            marginTop: 6,
          }}
        >
          ${stakes}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          background: "rgba(255,255,255,0.18)",
          padding: "12px 22px",
          borderRadius: 999,
          border: "2px solid rgba(255,255,255,0.5)",
          marginBottom: 36,
          animation: open ? "fadeUp 0.5s 0.65s both" : "none",
        }}
      >
        <StreakFlame count={weeks} size={44} />
        <div>
          <div
            style={{
              fontFamily: "var(--mono)",
              fontSize: 10,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              opacity: 0.9,
              fontWeight: 700,
            }}
          >
            Streak
          </div>
          <div
            style={{
              fontFamily: "var(--display)",
              fontSize: 28,
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            {weeks} weeks 🔥
          </div>
        </div>
      </div>

      <button
        onClick={onClose}
        style={{
          height: 60,
          padding: "0 44px",
          borderRadius: 16,
          background: "var(--lime)",
          color: "var(--ink)",
          border: "3px solid var(--ink)",
          fontFamily: "var(--body)",
          fontSize: 16,
          fontWeight: 800,
          cursor: "pointer",
          boxShadow: "5px 5px 0 var(--lime-deep)",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          animation: open ? "fadeUp 0.5s 0.85s both" : "none",
        }}
      >
        Carry on →
      </button>
    </div>
  );
};

// Add a task — linked to a parent quest (any category, including Side)
export const AddTaskSheet = ({
  open,
  onClose,
  dispatch,
  goals = [],
  defaultGoalId,
}: {
  open: boolean;
  onClose: () => void;
  dispatch: Dispatch;
  goals?: Goal[];
  defaultGoalId?: string;
}) => {
  const [title, setTitle] = useState("");
  const [minutes, setMinutes] = useState(15);
  const eligible = goals.filter((g) => g.status !== "Pass");
  const [goalId, setGoalId] = useState(
    defaultGoalId || (eligible[0] && eligible[0].id) || ""
  );
  useEffect(() => {
    if (open) {
      setTitle("");
      setMinutes(15);
      setGoalId(defaultGoalId || (eligible[0] && eligible[0].id) || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, defaultGoalId]);
  const submit = () => {
    if (!title.trim() || !goalId) return;
    dispatch({
      type: "ADD_TASK",
      goalId,
      title: title.trim(),
      minutes: Number(minutes) || null,
    });
    onClose();
  };

  const groupOrder: Category[] = ["Weekly", "Monthly", "Quarterly", "Side"];
  const groupColors: Record<string, string> = {
    Weekly: "var(--accent)",
    Monthly: "var(--purple)",
    Quarterly: "var(--magenta)",
    Side: "var(--teal)",
  };

  return (
    <Sheet open={open} onClose={onClose} title="New step ✓">
      <div
        style={{
          fontFamily: "var(--body)",
          fontSize: 14,
          color: "var(--ink-soft)",
          marginBottom: 22,
          lineHeight: 1.5,
          fontWeight: 500,
        }}
      >
        A small concrete step. Pick the quest it belongs to.
      </div>

      <Field label="Belongs to which quest">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            maxHeight: 280,
            overflowY: "auto",
            paddingRight: 4,
          }}
        >
          {groupOrder.map((cat) => {
            const inCat = eligible.filter((g) => g.category === cat);
            if (inCat.length === 0) return null;
            return (
              <div key={cat}>
                <div
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: groupColors[cat],
                    marginBottom: 6,
                    paddingLeft: 2,
                  }}
                >
                  {cat}
                  {cat !== "Side" ? " quests" : " quests · no stake"}
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                  }}
                >
                  {inCat.map((g) => {
                    const active = goalId === g.id;
                    return (
                      <button
                        key={g.id}
                        onClick={() => setGoalId(g.id)}
                        style={{
                          textAlign: "left",
                          padding: "10px 12px",
                          background: active ? groupColors[cat] : "white",
                          color: active ? "white" : "var(--ink)",
                          border: "2px solid var(--ink)",
                          borderRadius: 10,
                          boxShadow: active
                            ? "none"
                            : "2px 2px 0 var(--ink)",
                          transform: active
                            ? "translate(2px,2px)"
                            : "translate(0,0)",
                          fontFamily: "var(--body)",
                          fontSize: 13.5,
                          fontWeight: 600,
                          lineHeight: 1.3,
                          cursor: "pointer",
                          transition: "transform 0.06s, box-shadow 0.06s",
                        }}
                      >
                        {g.title}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </Field>

      <Field label="Step">
        <Input
          value={title}
          onChange={setTitle}
          placeholder="e.g. Open the Fidelity app"
        />
      </Field>

      <Field label="Estimate">
        <SegmentedControl
          options={[
            { value: 5, label: "5 min" },
            { value: 10, label: "10 min" },
            { value: 15, label: "15 min" },
          ]}
          value={minutes}
          onChange={(v) => setMinutes(Number(v))}
        />
      </Field>

      <Button
        variant="primary"
        fullWidth
        size="lg"
        onClick={submit}
        style={{ marginTop: 8 }}
      >
        Add step
      </Button>
    </Sheet>
  );
};
