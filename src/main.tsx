import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { supabaseConfigError } from "./lib/supabase";

const root = createRoot(document.getElementById("root")!);

if (supabaseConfigError) {
  root.render(
    <div
      style={{
        maxWidth: 420,
        margin: "15vh auto",
        padding: "28px 24px",
        background: "var(--paper)",
        color: "var(--ink)",
        border: "2px solid var(--ink)",
        borderRadius: 16,
        boxShadow: "6px 6px 0 var(--ink)",
        fontFamily: "var(--body)",
      }}
    >
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
      <div className="app-shell">
        <App />
      </div>
    </StrictMode>,
  );
}
