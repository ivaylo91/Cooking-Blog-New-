"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

const CHANGE_EVENT = "kbi-stored-set";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

// Where storage is blocked (some private modes), ticks still have to work for
// the session, so every write is mirrored here and read back as a fallback.
const memory = new Map<string, string>();

function read(key: string): string {
  try {
    return localStorage.getItem(key) ?? "";
  } catch {
    return memory.get(key) ?? "";
  }
}

/**
 * A set of ids kept in localStorage, so ticked ingredients and finished steps
 * survive the phone switching apps mid-cook. The server renders nothing ticked;
 * the browser fills in what it remembers after hydration.
 */
export function useStoredSet(key: string) {
  const raw = useSyncExternalStore(
    subscribe,
    () => read(key),
    () => ""
  );
  const values = useMemo(() => new Set(raw ? raw.split(",") : []), [raw]);

  const write = useCallback(
    (next: Set<string>) => {
      const value = [...next].join(",");
      memory.set(key, value);
      try {
        if (next.size === 0) localStorage.removeItem(key);
        else localStorage.setItem(key, value);
      } catch {
        // Blocked storage: `memory` above carries the ticks for this session.
      }
      window.dispatchEvent(new Event(CHANGE_EVENT));
    },
    [key]
  );

  const toggle = useCallback(
    (id: string) => {
      const next = new Set(values);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      write(next);
    },
    [values, write]
  );

  const clear = useCallback(() => write(new Set()), [write]);

  return { values, toggle, clear };
}
