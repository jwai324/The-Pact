import { useCallback, useEffect, useReducer, useRef } from "react";
import { emptyState, reducer } from "./reducer";
import type { Action, State } from "./types";
import { fetchAll, persist, persistSweep } from "../lib/api";
import { currentKeys, detectRollover } from "../lib/helpers";
import { subscribeAll } from "../lib/realtime";

export function usePactStore() {
  const [state, rawDispatch] = useReducer(reducer, undefined, emptyState);
  const stateRef = useRef<State>(state);
  stateRef.current = state;

  const timer = useRef<number | undefined>(undefined);

  const doRefetch = useCallback(async () => {
    try {
      let data = await fetchAll();
      // Catch up quests whose period ended while the app was closed. Correct
      // the DB first, then re-read it, so HYDRATE always reflects DB truth —
      // a failed/partial sweep just self-heals on the next open.
      const rollover = detectRollover(data, currentKeys());
      if (rollover.changed) {
        await persistSweep(rollover, data);
        data = await fetchAll();
      }
      rawDispatch({ type: "HYDRATE", data });
    } catch (err) {
      console.error("[store] refetch failed", err);
      rawDispatch({ type: "LOAD_FAILED" });
    }
  }, []);

  const scheduleRefetch = useCallback(() => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(doRefetch, 250);
  }, [doRefetch]);

  const dispatch = useCallback(
    (action: Action) => {
      const prev = stateRef.current;
      rawDispatch(action);
      persist(action, prev).then((wrote) => {
        if (wrote) scheduleRefetch();
      });
    },
    [scheduleRefetch]
  );

  useEffect(() => {
    doRefetch();
    const unsub = subscribeAll(scheduleRefetch);
    return () => {
      unsub();
      window.clearTimeout(timer.current);
    };
  }, [doRefetch, scheduleRefetch]);

  return [state, dispatch] as const;
}
