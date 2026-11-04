/**
 * The visitor's "don't count my visits" choice, kept on their device. Vercel
 * Analytics and Speed Insights ask before every event (`beforeSend`), so the
 * choice takes effect at once, without a reload.
 */
const KEY = "analytics-opt-out";
const CHANGE = "analytics-opt-out-change";

export function analyticsOptedOut(): boolean {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

export function setAnalyticsOptedOut(optedOut: boolean): void {
  try {
    if (optedOut) localStorage.setItem(KEY, "1");
    else localStorage.removeItem(KEY);
  } catch {
    // Storage blocked: nothing to remember, and nothing was being counted
    // differently either.
  }
  window.dispatchEvent(new Event(CHANGE));
}

/** For useSyncExternalStore: this tab's changes and other tabs' alike. */
export function subscribeAnalyticsOptOut(callback: () => void): () => void {
  window.addEventListener(CHANGE, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CHANGE, callback);
    window.removeEventListener("storage", callback);
  };
}
