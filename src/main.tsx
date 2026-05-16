import { Component, StrictMode, type ErrorInfo, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { supabaseConfigError } from "./lib/supabase";

const messageCardStyle = {
  maxWidth: 420,
  margin: "15vh auto",
  padding: "28px 24px",
  background: "var(--paper)",
  color: "var(--ink)",
  border: "2px solid var(--ink)",
  borderRadius: 16,
  boxShadow: "6px 6px 0 var(--ink)",
  fontFamily: "var(--body)",
} as const;

// Any render error anywhere in the tree would otherwise unmount everything
// and leave a blank white page (React 18 has no default fallback UI).
class ErrorBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  state: { error: Error | null } = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[app] render crash", error, info);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div style={messageCardStyle}>
        <h1 style={{ font: "700 22px/1.2 var(--display)", margin: "0 0 10px" }}>
          Something broke
        </h1>
        <p style={{ margin: "0 0 18px", color: "var(--ink-soft)" }}>
          The app hit an unexpected error and stopped. Reloading usually fixes
          it.
        </p>
        <button
          onClick={() => location.reload()}
          style={{
            appearance: "none",
            border: "2px solid var(--ink)",
            background: "var(--accent)",
            color: "white",
            font: "700 14px var(--body)",
            padding: "12px 18px",
            borderRadius: 12,
            boxShadow: "3px 3px 0 var(--ink)",
            cursor: "pointer",
          }}
        >
          Reload
        </button>
      </div>
    );
  }
}

const root = createRoot(document.getElementById("root")!);

if (supabaseConfigError) {
  root.render(
    <div style={messageCardStyle}>
      <h1 style={{ font: "700 22px/1.2 var(--display)", margin: "0 0 10px" }}>
        Configuration needed
      </h1>
      <p style={{ margin: "0 0 14px", color: "var(--ink-soft)" }}>
        {supabaseConfigError}
      </p>
      <p style={{ margin: 0, fontSize: 13, color: "var(--muted)" }}>
        For the deployed site, add the secrets under{" "}
        <strong>Settings → Secrets and variables → Actions</strong> and re-run
        the deploy workflow.
      </p>
    </div>,
  );
} else {
  root.render(
    <StrictMode>
      <ErrorBoundary>
        <div className="app-shell">
          <App />
        </div>
      </ErrorBoundary>
    </StrictMode>,
  );
}

// React has mounted (or rendered a readable message) — stop the index.html
// blank-screen watchdog so it doesn't overwrite the app.
window.__pactCancelBoot?.();
