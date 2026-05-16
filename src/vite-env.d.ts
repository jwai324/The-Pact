/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  // Cancels index.html's blank-screen watchdog once React has mounted.
  __pactCancelBoot?: () => void;
}
