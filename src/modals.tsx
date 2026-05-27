// Modals (bottom sheets) for The Pact — gamified (ported from modals.jsx)
import { useState, useEffect } from "react";
import {
  Sheet,
  Field,
  Input,
  SegmentedControl,
  Button,
} from "./components/ui";
import type {
  Action,
  Category,
  Goal,
  SpendCategory,
} from "./state/types";

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
          : defaultCategory === "Side"
          ? 0
          : 150
      );
    }
  }, [open, defaultCategory]);
  useEffect(() => {
    setStake(
      category === "Weekly"
        ? 50
        : category === "Monthly"
        ? 100
        : category === "Side"
        ? 0
        : 150
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
          options={["Weekly", "Monthly", "Quarterly", "Side"]}
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

export const AddFutureGoalSheet = ({
  open,
  onClose,
  dispatch,
}: {
  open: boolean;
  onClose: () => void;
  dispatch: Dispatch;
}) => {
  const [title, setTitle] = useState("");
  const [stake, setStake] = useState(50);
  useEffect(() => {
    if (open) {
      setTitle("");
      setStake(50);
    }
  }, [open]);
  const submit = () => {
    if (!title.trim()) return;
    dispatch({ type: "ADD_FUTURE_GOAL", title: title.trim(), stake });
    onClose();
  };
  return (
    <Sheet open={open} onClose={onClose} title="Stash a quest 🗄️">
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
        Parked and safe — no deadline, no auto-fail. Pick its spot later.
      </div>
      <Field label="Quest">
        <Input
          value={title}
          onChange={setTitle}
          placeholder="e.g. Open a brokerage account"
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
        Stash it
      </Button>
    </Sheet>
  );
};

export const LogSpendSheet = ({
  open,
  onClose,
  dispatch,
  defaultCategory,
}: {
  open: boolean;
  onClose: () => void;
  dispatch: Dispatch;
  defaultCategory?: SpendCategory;
}) => {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [category, setCategory] = useState<SpendCategory>(
    defaultCategory ?? "Necessities"
  );
  useEffect(() => {
    if (open) {
      setAmount("");
      setNote("");
      setCategory(defaultCategory ?? "Necessities");
    }
  }, [open, defaultCategory]);
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
  const cats: { name: SpendCategory; color: string; hint: string }[] = [
    { name: "Necessities", color: "var(--teal)", hint: "food, shelter" },
    {
      name: "Semi-necessities",
      color: "var(--purple)",
      hint: "home repair, work supplies",
    },
    { name: "Discretionary", color: "var(--magenta)", hint: "movies, fun" },
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
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {cats.map((c) => {
            const active = category === c.name;
            return (
              <button
                key={c.name}
                onClick={() => setCategory(c.name)}
                style={{
                  padding: "12px 14px",
                  borderRadius: 12,
                  cursor: "pointer",
                  background: active ? c.color : "white",
                  color: active ? "white" : "var(--ink)",
                  border: `2px solid var(--ink)`,
                  boxShadow: active ? "2px 2px 0 var(--ink)" : "none",
                  fontFamily: "var(--body)",
                  fontWeight: 700,
                  letterSpacing: "0.02em",
                  textAlign: "left",
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <span style={{ fontSize: 14 }}>{c.name}</span>
                <span
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    opacity: active ? 0.85 : 0.6,
                  }}
                >
                  {c.hint}
                </span>
              </button>
            );
          })}
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
  category,
  current,
}: {
  open: boolean;
  onClose: () => void;
  dispatch: Dispatch;
  category: SpendCategory;
  current: number;
}) => {
  const [amount, setAmount] = useState(String(current));
  useEffect(() => {
    if (open) setAmount(String(current));
  }, [open, current]);
  const submit = () => {
    const n = Number(amount);
    if (!amount || !Number.isFinite(n) || n < 0) return;
    dispatch({ type: "SET_BUDGET", category, amount: n });
    onClose();
  };
  const hint =
    category === "Necessities"
      ? "food, shelter"
      : category === "Semi-necessities"
      ? "home repair, work supplies"
      : "movies, fun";
  return (
    <Sheet open={open} onClose={onClose} title={`${category} budget`}>
      <Field
        label={`Weekly cap for ${category.toLowerCase()} (${hint})`}
      >
        <Input
          value={amount}
          onChange={setAmount}
          prefix="$"
          inputMode="decimal"
          placeholder="100"
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

export const EditStreakSheet = ({
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
    if (amount === "" || !Number.isFinite(n) || n < 0) return;
    dispatch({ type: "SET_STREAK", value: Math.max(0, Math.floor(n)) });
    onClose();
  };
  return (
    <Sheet open={open} onClose={onClose} title="Streak (weeks)">
      <Field label="How many weeks is the streak?">
        <Input
          value={amount}
          onChange={setAmount}
          inputMode="numeric"
          placeholder="0"
        />
      </Field>
      <Button
        variant="primary"
        fullWidth
        size="lg"
        onClick={submit}
        style={{ marginTop: 8 }}
      >
        Save streak
      </Button>
    </Sheet>
  );
};

export const EditSavedSheet = ({
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
    if (amount === "" || !Number.isFinite(n) || n < 0) return;
    dispatch({ type: "SET_SAVED", value: n });
    onClose();
  };
  return (
    <Sheet open={open} onClose={onClose} title="Saved from anti-charity">
      <Field label="Total saved from anti-charity">
        <Input
          value={amount}
          onChange={setAmount}
          prefix="$"
          inputMode="decimal"
          placeholder="0"
        />
      </Field>
      <Button
        variant="primary"
        fullWidth
        size="lg"
        onClick={submit}
        style={{ marginTop: 8 }}
      >
        Save total
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
  // null = standalone task (no quest). Defaults to the first eligible quest
  // when one exists, otherwise standalone so a task is always creatable.
  const initialGoal = (): string | null =>
    defaultGoalId ?? (eligible[0]?.id ?? null);
  const [goalId, setGoalId] = useState<string | null>(initialGoal);
  useEffect(() => {
    if (open) {
      setTitle("");
      setMinutes(15);
      setGoalId(initialGoal());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, defaultGoalId]);
  const submit = () => {
    if (!title.trim()) return;
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
        A small concrete step. Tie it to a quest, or keep it standalone.
      </div>

      <Field label="Belongs to which quest (optional)">
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
          <button
            onClick={() => setGoalId(null)}
            style={{
              textAlign: "left",
              padding: "10px 12px",
              background: goalId === null ? "var(--ink)" : "white",
              color: goalId === null ? "white" : "var(--ink)",
              border: "2px solid var(--ink)",
              borderRadius: 10,
              boxShadow:
                goalId === null ? "none" : "2px 2px 0 var(--ink)",
              transform:
                goalId === null
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
            No quest · standalone task
          </button>
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
