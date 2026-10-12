"use client";

import { useSyncExternalStore } from "react";

const KEY = "last-cooked";
const EVENT = "kbi-last-cooked";

export interface LastCooked {
  slug: string;
  title: string;
  /** Zero-based step the cook was on, when known. */
  step: number | null;
  at: number;
}

/** Remember the recipe someone is cooking, so the home page can offer it back. */
export function rememberCooking(slug: string, title: string, step: number | null = null) {
  const value: LastCooked = { slug, title, step, at: Date.now() };
  try {
    localStorage.setItem(KEY, JSON.stringify(value));
  } catch {
    // Blocked storage only means there is nothing to resume later.
  }
  window.dispatchEvent(new Event(EVENT));
}

export function forgetCooking() {
  try {
    localStorage.removeItem(KEY);
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(EVENT, callback);
  };
}

// A week covers a dish left half-made; older than that it is noise. The age
// check lives here, in the store read, so the component render stays pure.
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

function read(): string {
  try {
    const raw = localStorage.getItem(KEY) ?? "";
    if (!raw) return "";
    const at = (JSON.parse(raw) as LastCooked).at;
    return Date.now() - at > MAX_AGE_MS ? "" : raw;
  } catch {
    return "";
  }
}

export function useLastCooked(): LastCooked | null {
  const raw = useSyncExternalStore(subscribe, read, () => "");
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as LastCooked;
    if (!value.slug) return null;
    return value;
  } catch {
    return null;
  }
}
