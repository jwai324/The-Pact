import { createClient } from "@supabase/supabase-js";

// Built-in defaults so the app shows live data even when no env vars /
// GitHub Actions secrets are configured. This is safe by design: the app
// has no auth and the publishable key is meant to ship in the client
// bundle (see .env.example). Env vars still take precedence so a different
// project can be pointed at without code changes.
const DEFAULT_SUPABASE_URL = "https://xvjsnfbvywavzdrjdfvi.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY = "sb_publishable_FxpzEQdH-DNy6xti0DffdQ_PTYcnKdJ";

// Trimmed so a secret pasted with a trailing newline/space (a very common
// mistake for GitHub Actions secrets) doesn't slip through as "present but
// malformed".
const url =
  import.meta.env.VITE_SUPABASE_URL?.trim() || DEFAULT_SUPABASE_URL;
const key =
  import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() || DEFAULT_SUPABASE_ANON_KEY;

const PLACEHOLDER_URL = "https://placeholder.supabase.co";
const PLACEHOLDER_KEY = "placeholder";

const placeholderOpts = { auth: { persistSession: false } } as const;

// Surfaced by main.tsx as a readable screen instead of a blank white page.
// Two failure modes are covered: missing env vars, and a malformed URL/key
// where createClient() throws at import time — that throw would otherwise
// crash the whole module graph before React mounts (a blank page).
let configError: string | null =
  !url || !key
    ? "Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. Set them in a local .env (copy .env.example) or as GitHub Actions repository secrets, then redeploy."
    : null;

function makeClient() {
  if (configError) {
    return createClient(PLACEHOLDER_URL, PLACEHOLDER_KEY, placeholderOpts);
  }
  try {
    return createClient(url!, key!, placeholderOpts);
  } catch (err) {
    console.error("[supabase] createClient failed", err);
    configError =
      "VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY look malformed — likely a stray space or newline in the value. Re-enter them (for the deployed site, as GitHub Actions secrets) and redeploy.";
    return createClient(PLACEHOLDER_URL, PLACEHOLDER_KEY, placeholderOpts);
  }
}

// The placeholder client below keeps imports working; it is never used for
// real requests because main.tsx short-circuits on supabaseConfigError.
export const supabase = makeClient();
export const supabaseConfigError = configError;
