// Shared components for The Pact — gamified theme (ported from components.jsx)
import {
  useState,
  useEffect,
  type CSSProperties,
  type ReactNode,
  type SVGProps,
  type MouseEvent,
} from "react";

export const Icon = ({
  name,
  size = 20,
  color = "currentColor",
  strokeWidth = 2,
  fill = "none",
  style,
}: {
  name: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
  fill?: string;
  style?: CSSProperties;
}) => {
  const props: SVGProps<SVGSVGElement> = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill,
    stroke: color,
    strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style,
  };
  const paths: Record<string, ReactNode> = {
    flame: (
      <>
        <path
          d="M12 2c1 5 5 6 5 11a5 5 0 0 1-10 0c0-3 2-3 2-6 0-2-1-3-1-4 2 1 3 1 4 0z"
          fill="#FF8A1F"
          stroke="#DD3618"
        />
        <path
          d="M12 9c.5 2 2 2.5 2 5a2 2 0 0 1-4 0c0-1.2.7-1.5 1-2.5.3-1-.5-1.5 1-2.5z"
          fill="#FFD56B"
          stroke="none"
        />
      </>
    ),
    plus: (
      <>
        <path d="M12 5v14M5 12h14" />
      </>
    ),
    check: (
      <>
        <path d="M20 6L9 17l-5-5" />
      </>
    ),
    x: (
      <>
        <path d="M18 6L6 18M6 6l12 12" />
      </>
    ),
    chevronRight: (
      <>
        <path d="M9 6l6 6-6 6" />
      </>
    ),
    chevronDown: (
      <>
        <path d="M6 9l6 6 6-6" />
      </>
    ),
    home: (
      <>
        <path d="M3 12l9-9 9 9M5 10v10h14V10" />
      </>
    ),
    target: (
      <>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      </>
    ),
    timer: (
      <>
        <circle cx="12" cy="13" r="8" />
        <path d="M12 9v4l2.5 2.5M9 2h6" />
      </>
    ),
    receipt: (
      <>
        <path d="M5 3v18l3-2 3 2 3-2 3 2V3z" />
        <path d="M9 8h6M9 12h6M9 16h4" />
      </>
    ),
    handshake: (
      <>
        <path d="M11 17l2 2a1 1 0 1 0 1.5-1.4l-1-1" />
        <path d="M14 16.5l2 2a1 1 0 1 0 1.4-1.4l-2-2" />
        <path d="M17 15l1.5 1.5a1 1 0 1 0 1.4-1.4L18 13.5l-3-3-3 3-2-2-3 3 3 3 2-2" />
        <path d="M3 10l4-4 3 3" />
        <path d="M21 10l-4-4-3 3" />
      </>
    ),
    bell: (
      <>
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
        <path d="M10 21a2 2 0 0 0 4 0" />
      </>
    ),
    download: (
      <>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
      </>
    ),
    trophy: (
      <>
        <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4z" />
        <path d="M17 5h3v3a3 3 0 0 1-3 3M7 5H4v3a3 3 0 0 0 3 3" />
      </>
    ),
    bolt: (
      <>
        <path
          d="M13 2L3 14h8l-1 8 10-12h-8l1-8z"
          fill="#FFB300"
          stroke="#DD8800"
        />
      </>
    ),
    star: (
      <>
        <path
          d="M12 2l3 7 7 .5-5 5 1.5 7-6.5-3.5-6.5 3.5L7 14.5l-5-5L9 9l3-7z"
          fill="#FFB300"
          stroke="#DD8800"
        />
      </>
    ),
    heart: (
      <>
        <path
          d="M12 21s-7-4.5-7-11a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 6.5-7 11-7 11z"
          fill="#E63992"
          stroke="#B01A6E"
        />
      </>
    ),
    coin: (
      <>
        <circle cx="12" cy="12" r="9" fill="#FFD66B" stroke="#C99000" />
        <circle
          cx="12"
          cy="12"
          r="6"
          fill="none"
          stroke="#C99000"
          strokeOpacity="0.4"
        />
        <text
          x="12"
          y="16"
          textAnchor="middle"
          fontSize="9"
          fontWeight="700"
          fill="#8A6300"
          stroke="none"
        >
          $
        </text>
      </>
    ),
    sparkle: (
      <>
        <path
          d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"
          fill="#FFD56B"
          stroke="#DD8800"
        />
      </>
    ),
    lock: (
      <>
        <rect x="5" y="11" width="14" height="10" rx="2" />
        <path d="M8 11V7a4 4 0 0 1 8 0v4" />
      </>
    ),
    shield: (
      <>
        <path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-4z" />
      </>
    ),
    pencil: (
      <>
        <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
      </>
    ),
    crown: (
      <>
        <path
          d="M3 18h18l-1-9-5 4-4-7-4 7-5-4z"
          fill="#FFB300"
          stroke="#DD8800"
        />
      </>
    ),
    checkSquare: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <path d="M8 12l3 3 5-7" />
      </>
    ),
    feather: (
      <>
        <path
          d="M20 4c-3 0-9 2-12 5s-5 9-5 11l4-4M14 7l3 3M9 11l4 4M11 9l4 4M16 5l3 3"
          fill="#FFD56B"
          stroke="#DD8800"
        />
      </>
    ),
    list: (
      <>
        <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
      </>
    ),
  };
  return <svg {...props}>{paths[name]}</svg>;
};

// Chunky card with thick border + offset shadow
export const Card = ({
  children,
  style = {},
  padded = true,
  onClick,
  color = "white",
  offset = 4,
}: {
  children: ReactNode;
  style?: CSSProperties;
  padded?: boolean;
  onClick?: () => void;
  color?: string;
  offset?: number;
}) => (
  <div
    onClick={onClick}
    style={{
      background: color,
      border: "2px solid var(--ink)",
      borderRadius: 18,
      padding: padded ? 20 : 0,
      boxShadow: `${offset}px ${offset}px 0 var(--ink)`,
      cursor: onClick ? "pointer" : "default",
      ...style,
    }}
  >
    {children}
  </div>
);

export const Eyebrow = ({
  children,
  style = {},
}: {
  children: ReactNode;
  style?: CSSProperties;
}) => (
  <div
    style={{
      fontFamily: "var(--mono)",
      fontSize: 11,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color: "var(--ink-soft)",
      fontWeight: 600,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Display = ({
  children,
  size = 56,
  weight = 600,
  style = {},
}: {
  children: ReactNode;
  size?: number;
  weight?: number;
  style?: CSSProperties;
}) => (
  <div
    style={{
      fontFamily: "var(--display)",
      fontSize: size,
      lineHeight: 0.95,
      letterSpacing: "-0.025em",
      fontWeight: weight,
      color: "var(--ink)",
      ...style,
    }}
  >
    {children}
  </div>
);

type ButtonVariant =
  | "primary"
  | "accent"
  | "pass"
  | "lime"
  | "fail"
  | "danger"
  | "purple"
  | "magenta"
  | "gold"
  | "ghost";

// Chunky bouncy button — big offset shadow, presses down on click
export const Button = ({
  children,
  variant = "primary",
  onClick,
  style = {},
  fullWidth = false,
  disabled = false,
  size = "md",
}: {
  children: ReactNode;
  variant?: ButtonVariant;
  onClick?: () => void;
  style?: CSSProperties;
  fullWidth?: boolean;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}) => {
  const sizes = {
    sm: { height: 38, fontSize: 13, padding: "0 14px", radius: 10, shadow: 3 },
    md: { height: 52, fontSize: 15, padding: "0 22px", radius: 14, shadow: 4 },
    lg: { height: 60, fontSize: 16, padding: "0 26px", radius: 16, shadow: 5 },
  };
  const variants: Record<
    ButtonVariant,
    { bg: string; fg: string; shadowColor: string }
  > = {
    primary: { bg: "var(--ink)", fg: "white", shadowColor: "#000" },
    accent: { bg: "var(--accent)", fg: "white", shadowColor: "var(--accent-deep)" },
    pass: { bg: "var(--green)", fg: "white", shadowColor: "#1FA046" },
    lime: { bg: "var(--lime)", fg: "var(--ink)", shadowColor: "var(--lime-deep)" },
    fail: { bg: "white", fg: "var(--red)", shadowColor: "var(--red)" },
    danger: { bg: "var(--red)", fg: "white", shadowColor: "#A82A2A" },
    purple: { bg: "var(--purple)", fg: "white", shadowColor: "#5634D4" },
    magenta: { bg: "var(--magenta)", fg: "white", shadowColor: "#B01A6E" },
    gold: { bg: "var(--gold)", fg: "var(--ink)", shadowColor: "#DD8800" },
    ghost: { bg: "white", fg: "var(--ink)", shadowColor: "var(--ink)" },
  };
  const s = sizes[size];
  const v = variants[variant];
  return (
    <button
      onClick={disabled ? undefined : onClick}
      onMouseDown={(e: MouseEvent<HTMLButtonElement>) => {
        if (!disabled)
          e.currentTarget.style.transform = `translate(${s.shadow}px, ${s.shadow}px)`;
        e.currentTarget.style.boxShadow = "0 0 0 var(--ink)";
      }}
      onMouseUp={(e: MouseEvent<HTMLButtonElement>) => {
        e.currentTarget.style.transform = "translate(0,0)";
        e.currentTarget.style.boxShadow = `${s.shadow}px ${s.shadow}px 0 ${
          v.shadowColor === "#000" ? "var(--ink)" : v.shadowColor
        }`;
      }}
      onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => {
        e.currentTarget.style.transform = "translate(0,0)";
        e.currentTarget.style.boxShadow = `${s.shadow}px ${s.shadow}px 0 ${
          v.shadowColor === "#000" ? "var(--ink)" : v.shadowColor
        }`;
      }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        height: s.height,
        padding: s.padding,
        fontSize: s.fontSize,
        borderRadius: s.radius,
        fontFamily: "var(--body)",
        fontWeight: 700,
        cursor: disabled ? "not-allowed" : "pointer",
        background: v.bg,
        color: v.fg,
        border: "2px solid var(--ink)",
        boxShadow: `${s.shadow}px ${s.shadow}px 0 ${
          v.shadowColor === "#000" ? "var(--ink)" : v.shadowColor
        }`,
        width: fullWidth ? "100%" : undefined,
        opacity: disabled ? 0.4 : 1,
        transition: "transform 0.06s, box-shadow 0.06s",
        textTransform: "uppercase",
        letterSpacing: "0.04em",
        ...style,
      }}
    >
      {children}
    </button>
  );
};

type PillTone =
  | "neutral"
  | "pass"
  | "fail"
  | "pending"
  | "gold"
  | "accent"
  | "purple"
  | "magenta"
  | "teal"
  | "sky"
  | "lime"
  | "ink";

export const Pill = ({
  children,
  tone = "neutral",
  style = {},
}: {
  children: ReactNode;
  tone?: PillTone;
  style?: CSSProperties;
}) => {
  const tones: Record<PillTone, { bg: string; fg: string }> = {
    neutral: { bg: "var(--paper-deep)", fg: "var(--ink)" },
    pass: { bg: "var(--green)", fg: "white" },
    fail: { bg: "var(--red)", fg: "white" },
    pending: { bg: "white", fg: "var(--ink-soft)" },
    gold: { bg: "var(--gold)", fg: "var(--ink)" },
    accent: { bg: "var(--accent)", fg: "white" },
    purple: { bg: "var(--purple)", fg: "white" },
    magenta: { bg: "var(--magenta)", fg: "white" },
    teal: { bg: "var(--teal)", fg: "white" },
    sky: { bg: "var(--sky)", fg: "white" },
    lime: { bg: "var(--lime)", fg: "var(--ink)" },
    ink: { bg: "var(--ink)", fg: "white" },
  };
  const t = tones[tone];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "5px 11px",
        borderRadius: 999,
        fontSize: 11,
        fontFamily: "var(--body)",
        letterSpacing: "0.04em",
        background: t.bg,
        color: t.fg,
        border: "2px solid var(--ink)",
        fontWeight: 700,
        textTransform: "uppercase",
        ...style,
      }}
    >
      {children}
    </span>
  );
};

export const Money = ({
  amount,
  size = 14,
  weight = 600,
  color = "var(--ink)",
  style = {},
}: {
  amount: number;
  size?: number;
  weight?: number;
  color?: string;
  style?: CSSProperties;
}) => (
  <span
    style={{
      fontFamily: "var(--mono)",
      fontVariantNumeric: "tabular-nums",
      fontSize: size,
      fontWeight: weight,
      color,
      letterSpacing: "-0.01em",
      ...style,
    }}
  >
    $
    {amount.toLocaleString("en-US", {
      minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2,
    })}
  </span>
);

// Chunky progress bar with thick border
export const ProgressBar = ({
  value,
  max = 1,
  color = "var(--accent)",
  height = 14,
}: {
  value: number;
  max?: number;
  color?: string;
  height?: number;
}) => {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div
      style={{
        width: "100%",
        height,
        background: "white",
        border: "2px solid var(--ink)",
        borderRadius: 999,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        style={{
          width: `${pct}%`,
          height: "100%",
          background: color,
          borderRadius: 999,
          transition: "width 600ms cubic-bezier(0.32, 0.72, 0, 1)",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: "2px 4px auto 4px",
            height: "30%",
            background: "rgba(255,255,255,0.5)",
            borderRadius: 999,
          }}
        />
      </div>
    </div>
  );
};

export const Divider = ({ style = {} }: { style?: CSSProperties }) => (
  <div
    style={{ height: 2, background: "var(--ink)", opacity: 0.1, ...style }}
  />
);

// Bigger more colorful confetti
export const Confetti = ({ trigger }: { trigger: number }) => {
  const [bursts, setBursts] = useState<number[]>([]);
  useEffect(() => {
    if (!trigger) return;
    const id = Date.now();
    setBursts((b) => [...b, id]);
    const t = setTimeout(
      () => setBursts((b) => b.filter((x) => x !== id)),
      2200
    );
    return () => clearTimeout(t);
  }, [trigger]);
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 9999,
        overflow: "hidden",
      }}
    >
      {bursts.map((id) => (
        <div key={id}>
          {Array.from({ length: 50 }).map((_, i) => {
            const colors = [
              "#FF5A3C",
              "#E63992",
              "#7B5CFF",
              "#1FBFA8",
              "#2DC55E",
              "#FFB300",
              "#34B6FF",
              "#B8FF3C",
            ];
            const angle = (Math.random() - 0.5) * 160;
            const dist = 200 + Math.random() * 220;
            const dx = Math.sin((angle * Math.PI) / 180) * dist;
            const dy =
              -Math.cos((angle * Math.PI) / 180) * dist +
              Math.random() * 320;
            const rot = (Math.random() - 0.5) * 1080;
            const w = 8 + Math.random() * 6;
            const h = 10 + Math.random() * 12;
            const shape = Math.random();
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: w,
                  height: h,
                  background: colors[i % colors.length],
                  borderRadius: shape > 0.66 ? 999 : shape > 0.33 ? 2 : 0,
                  animation: `confetti-${id}-${i} 1.8s cubic-bezier(0.2, 0.6, 0.3, 1) forwards`,
                  border: "1.5px solid rgba(0,0,0,0.3)",
                }}
              >
                <style>{`
                  @keyframes confetti-${id}-${i} {
                    0% { transform: translate(-50%,-50%) rotate(0deg); opacity: 1; }
                    100% { transform: translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) rotate(${rot}deg); opacity: 0; }
                  }
                `}</style>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export const Sheet = ({
  open,
  onClose,
  children,
  title,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}) => {
  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);
  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(27, 17, 64, 0.5)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 220ms ease",
          zIndex: 100,
        }}
      />
      <div
        style={{
          position: "fixed",
          left: "50%",
          bottom: 0,
          zIndex: 101,
          width: "100%",
          maxWidth: 480,
          transform: `translateX(-50%) ${
            open ? "translateY(0)" : "translateY(100%)"
          }`,
          background: "var(--paper)",
          borderRadius: "24px 24px 0 0",
          border: "2px solid var(--ink)",
          borderBottom: "none",
          padding: "10px 20px calc(28px + env(safe-area-inset-bottom))",
          transition: "transform 320ms cubic-bezier(0.32, 0.72, 0, 1)",
          maxHeight: "85dvh",
          overflow: "auto",
          visibility: open ? "visible" : "hidden",
          pointerEvents: open ? "auto" : "none",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            paddingBottom: 14,
          }}
        >
          <div
            style={{
              width: 44,
              height: 5,
              borderRadius: 999,
              background: "var(--ink)",
              opacity: 0.2,
            }}
          />
        </div>
        {title && (
          <div style={{ marginBottom: 18 }}>
            <Display size={32} weight={700}>
              {title}
            </Display>
          </div>
        )}
        {children}
      </div>
    </>
  );
};

export const Field = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => (
  <label style={{ display: "block", marginBottom: 16 }}>
    <Eyebrow style={{ marginBottom: 8 }}>{label}</Eyebrow>
    {children}
  </label>
);

export const Input = ({
  value,
  onChange,
  placeholder,
  type = "text",
  inputMode,
  prefix,
  style = {},
}: {
  value: string | number;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  inputMode?: "decimal" | "text" | "numeric";
  prefix?: string;
  style?: CSSProperties;
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      background: "white",
      border: "2px solid var(--ink)",
      borderRadius: 12,
      padding: "0 14px",
      height: 52,
      boxShadow: "3px 3px 0 var(--ink)",
      fontFamily:
        type === "number" || inputMode === "decimal"
          ? "var(--mono)"
          : "var(--body)",
      ...style,
    }}
  >
    {prefix && (
      <span
        style={{
          color: "var(--ink-soft)",
          marginRight: 6,
          fontFamily: "var(--mono)",
          fontWeight: 600,
        }}
      >
        {prefix}
      </span>
    )}
    <input
      type={type}
      inputMode={inputMode}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        flex: 1,
        border: "none",
        background: "transparent",
        outline: "none",
        fontFamily: "inherit",
        fontSize: 16,
        color: "var(--ink)",
        height: "100%",
        fontWeight: 500,
      }}
    />
  </div>
);

type SegOption = string | { value: string | number; label: string };

export const SegmentedControl = ({
  options,
  value,
  onChange,
}: {
  options: SegOption[];
  value: string | number;
  onChange: (v: string | number) => void;
}) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: `repeat(${options.length}, 1fr)`,
      background: "white",
      border: "2px solid var(--ink)",
      borderRadius: 12,
      padding: 4,
      gap: 4,
      boxShadow: "3px 3px 0 var(--ink)",
    }}
  >
    {options.map((opt) => {
      const v = typeof opt === "string" ? opt : opt.value;
      const label = typeof opt === "string" ? opt : opt.label;
      const active = value === v;
      return (
        <button
          key={String(v)}
          onClick={() => onChange(v)}
          style={{
            height: 40,
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            background: active ? "var(--ink)" : "transparent",
            color: active ? "white" : "var(--ink-soft)",
            fontFamily: "var(--body)",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            transition: "background 120ms",
          }}
        >
          {label}
        </button>
      );
    })}
  </div>
);

// Animated streak flame
export const StreakFlame = ({
  count,
  size = 56,
}: {
  count: number;
  size?: number;
}) => (
  <div
    style={{
      position: "relative",
      width: size,
      height: size,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      animation: "flameWiggle 2s ease-in-out infinite",
    }}
  >
    <Icon name="flame" size={size} />
    <span
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--display)",
        fontSize: size * 0.36,
        fontWeight: 800,
        color: "white",
        textShadow: "0 1px 2px rgba(0,0,0,0.4)",
        paddingTop: size * 0.1,
      }}
    >
      {count}
    </span>
  </div>
);

export {
  formatRelative,
  formatCountdown,
  getLevel,
  LEVELS,
} from "../lib/helpers";
