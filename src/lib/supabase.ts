import { createClient } from "@supabase/supabase-js";

// Built-in defaults so the app shows live data even when no env vars /
// GitHub Actions secrets are configured. This is safe by design: the app
// has no auth and the anon key is meant to ship in the client bundle (see
// .env.example). A usable env var still takes precedence so a different
// project can be pointed at without code changes — but a malformed or
// placeholder env value is ignored in favor of the working default (see
// the env validation below).
//
// Use the legacy anon JWT (not the sb_publishable_ key): supabase-js sends
// the key as a Bearer token and PostgREST resolves the `anon` role from
// the JWT directly, whereas the publishable key isn't decoded that way and
// every query comes back empty.
const DEFAULT_SUPABASE_URL = "https://xvjsnfbvywavzdrjdfvi.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2anNuZmJ2eXdhdnpkcmpkZnZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxMTU4MTAsImV4cCI6MjA5MzY5MTgxMH0.5faWdKjhxXeDFgODPnOYbzhueZmehQADM0TktteSKUM";

// An env value is used only if it actually looks usable; otherwise we fall
// back to the verified-good built-in default. The GitHub Actions deploy
// injects VITE_SUPABASE_* secrets that override the default at build time,
// so a secret holding a `sb_publishable_` key or an .env.example
// placeholder would otherwise ship in the bundle and make every query come
// back empty. Trimming also defends against a stray newline/space, a very
// common GitHub Actions secret mistake.
const envUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

const usableUrl =
  envUrl &&
  envUrl.startsWith("https://") &&
  !envUrl.includes("YOUR-PROJECT-REF")
    ? envUrl
    : undefined;

// Must be a legacy anon JWT (its `{"alg":...}` header base64url-encodes to
// the `eyJ` prefix). This inherently rejects a `sb_publishable_` /
// `sb_secret_` key and the .env.example placeholder, so the working
// default JWT is used instead of a key that returns no data.
const usableKey = envKey && envKey.startsWith("eyJ") ? envKey : undefined;

const url = usableUrl || DEFAULT_SUPABASE_URL;
const key = usableKey || DEFAULT_SUPABASE_ANON_KEY;

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
