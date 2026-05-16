import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Surfaced by main.tsx as a readable screen instead of throwing at import
// time (which would render a blank white page). The placeholder client below
// keeps imports working; it is never used because main.tsx short-circuits.
export const supabaseConfigError =
  !url || !key
    ? "Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. Set them in a local .env (copy .env.example) or as GitHub Actions repository secrets, then redeploy."
    : null;

export const supabase = createClient(
  url || "https://placeholder.supabase.co",
  key || "placeholder",
  { auth: { persistSession: false } },
);
