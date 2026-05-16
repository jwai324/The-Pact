import { supabase } from "./supabase";

const TABLES = [
  "app_state",
  "goals",
  "tasks",
  "wants",
  "spending",
  "payments",
] as const;

// Subscribe to all data tables. Any change (from this client or the other
// participant) fires onChange — the store debounces it into a single refetch.
export function subscribeAll(onChange: () => void): () => void {
  const channel = supabase.channel("the-pact-realtime");
  for (const table of TABLES) {
    channel.on(
      "postgres_changes",
      { event: "*", schema: "public", table },
      onChange
    );
  }
  channel.subscribe();
  return () => {
    supabase.removeChannel(channel);
  };
}
