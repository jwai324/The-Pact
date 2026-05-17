// Trophy unlock animation: the trophy pops up large and centered, holds,
// then shrinks and flies into its slot in the Trophy Cabinet (located by
// the `trophy-slot-<id>` element id). If the cabinet isn't on screen it
// just shrinks away in place. Plays one trophy at a time (parent queues).
import { useEffect, useRef, useState } from "react";
import { Icon, Display } from "./ui";
import type { Trophy } from "../lib/trophies";

type Phase = "hidden" | "enter" | "hold" | "fly";

export const TrophyReveal = ({
  trophy,
  onDone,
}: {
  trophy: Trophy | null;
  onDone: () => void;
}) => {
  const [phase, setPhase] = useState<Phase>("hidden");
  const [fly, setFly] = useState<{ dx: number; dy: number; scale: number } | null>(
    null
  );
  const timers = useRef<number[]>([]);

  useEffect(() => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    if (!trophy) {
      setPhase("hidden");
      setFly(null);
      return;
    }
    const reduce = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    )?.matches;
    const holdMs = reduce ? 500 : 1500;
    const flyMs = reduce ? 200 : 700;

    setFly(null);
    setPhase("enter");
    // Let the browser paint the collapsed/transparent "enter" state before
    // switching to "hold" so the pop-in actually transitions.
    const t0 = window.setTimeout(() => setPhase("hold"), 40);

    const t1 = window.setTimeout(() => {
      const el = document.getElementById(`trophy-slot-${trophy.id}`);
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight * 0.42;
      if (el) {
        const r = el.getBoundingClientRect();
        setFly({
          dx: r.left + r.width / 2 - cx,
          dy: r.top + r.height / 2 - cy,
          scale: Math.max(0.14, Math.min(0.4, r.width / 140)),
        });
      } else {
        setFly({ dx: 0, dy: 0, scale: 0.2 });
      }
      setPhase("fly");
    }, holdMs);

    const t2 = window.setTimeout(() => onDone(), holdMs + flyMs + 80);

    timers.current = [t0, t1, t2];
    return () => {
      timers.current.forEach((t) => window.clearTimeout(t));
      timers.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trophy?.id]);

  if (!trophy || phase === "hidden") return null;

  const flying = phase === "fly" && !!fly;
  const SIZE = 140;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(27,17,64,0.55)",
          opacity: phase === "fly" ? 0 : 1,
          transition: "opacity 600ms ease",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "42%",
          width: SIZE,
          height: SIZE,
          transform: `translate(calc(-50% + ${
            flying ? fly!.dx : 0
          }px), calc(-50% + ${flying ? fly!.dy : 0}px)) scale(${
            phase === "enter" ? 0.3 : flying ? fly!.scale : 1
          })`,
          opacity: phase === "enter" ? 0 : flying ? 0.12 : 1,
          transition:
            phase === "enter"
              ? "none"
              : flying
              ? "transform 700ms cubic-bezier(0.5,0,0.2,1), opacity 700ms ease-in"
              : "transform 480ms cubic-bezier(0.34,1.56,0.64,1), opacity 320ms ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: SIZE,
            height: SIZE,
            borderRadius: 36,
            background: trophy.color,
            border: "3px solid var(--ink)",
            boxShadow: "6px 6px 0 var(--ink)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name={trophy.icon} size={72} color="white" strokeWidth={2.2} />
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "calc(42% + 112px)",
          textAlign: "center",
          opacity: phase === "hold" ? 1 : 0,
          transition: "opacity 360ms ease",
        }}
      >
        <div
          style={{
            fontFamily: "var(--mono)",
            fontSize: 12,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            fontWeight: 700,
            color: "white",
            marginBottom: 10,
          }}
        >
          Trophy unlocked
        </div>
        <Display size={40} weight={700} style={{ color: "white" }}>
          {trophy.name}
        </Display>
      </div>
    </div>
  );
};
