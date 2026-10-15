"use client";

import { useCallback, useSyncExternalStore } from "react";

const SERVINGS_CHANGE_EVENT = "kbi-stored-servings";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(SERVINGS_CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(SERVINGS_CHANGE_EVENT, callback);
  };
}

const memory = new Map<string, number>();

function readServings(key: string, base: number, max: number): number {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return memory.get(key) ?? base;
    const val = Number(raw);
    return Number.isInteger(val) && val >= 1 && val <= max ? val : base;
  } catch {
    return memory.get(key) ?? base;
  }
}

/**
 * Shared scaled servings for a recipe, kept in localStorage and synced across
 * the recipe page and Cook Mode via useSyncExternalStore and custom events.
 */
export function useStoredServings(recipeId: string, baseServings: number) {
  const maxServings = baseServings * 2;
  const key = `servings:${recipeId}`;

  const servings = useSyncExternalStore(
    subscribe,
    () => readServings(key, baseServings, maxServings),
    () => baseServings
  );

  const setServings = useCallback(
    (action: number | ((prev: number) => number)) => {
      const current = readServings(key, baseServings, maxServings);
      const next = typeof action === "function" ? action(current) : action;
      const clamped = Math.max(1, Math.min(maxServings, Math.round(next)));

      memory.set(key, clamped);
      try {
        if (clamped === baseServings) {
          localStorage.removeItem(key);
        } else {
          localStorage.setItem(key, String(clamped));
        }
      } catch {
        // Blocked storage fallback uses memory map
      }

      window.dispatchEvent(new Event(SERVINGS_CHANGE_EVENT));
    },
    [key, baseServings, maxServings]
  );

  return {
    servings,
    setServings,
    multiplier: servings / baseServings,
    maxServings,
  };
}

