"use client";

import { useState, useSyncExternalStore } from "react";
import { ChartColumn, Check, Eraser } from "lucide-react";
import {
  analyticsOptedOut,
  setAnalyticsOptedOut,
  subscribeAnalyticsOptOut,
} from "@/lib/analyticsOptOut";

/** The cooking keys the site writes; the statistics choice is kept apart. */
const COOKING_KEYS = ["theme", "last-cooked"];
const COOKING_PREFIXES = ["checked:", "done:", "servings:", "cook:", "rated:", "liked:"];

const control =
  "inline-flex min-h-11 items-center gap-2 rounded-full bg-surface px-5 py-2 font-semibold shadow-card transition-[background-color,transform] hover:bg-accent-soft active:scale-[0.97]";

/** A switch for Vercel's statistics, for this browser only. */
export function AnalyticsSwitch() {
  const optedOut = useSyncExternalStore(subscribeAnalyticsOptOut, analyticsOptedOut, () => false);

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        type="button"
        onClick={() => setAnalyticsOptedOut(!optedOut)}
        className={control}
      >
        <ChartColumn size={18} aria-hidden="true" />
        {optedOut ? "Включи броенето на посещенията ми" : "Не броете посещенията ми"}
      </button>
      <p aria-live="polite" className="text-small text-muted-foreground">
        {optedOut
          ? "Изключено: този браузър не изпраща статистика."
          : "Включено: посещенията се броят без бисквитки."}
      </p>
    </div>
  );
}

/** Forgets everything the recipes remembered on this device. */
export function ClearDeviceData() {
  const [cleared, setCleared] = useState(false);

  function clear() {
    try {
      for (const key of Object.keys(localStorage)) {
        if (COOKING_KEYS.includes(key) || COOKING_PREFIXES.some((prefix) => key.startsWith(prefix))) {
          localStorage.removeItem(key);
        }
      }
    } catch {
      // Storage blocked: there was nothing stored to clear.
    }
    setCleared(true);
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <button type="button" onClick={clear} className={control}>
        {cleared ? <Check size={18} aria-hidden="true" /> : <Eraser size={18} aria-hidden="true" />}
        Изчисти запазеното на това устройство
      </button>
      <p aria-live="polite" className="text-small text-muted-foreground">
        {cleared
          ? "Готово. Отметките, порциите, оценките и харесванията на това устройство са изчистени."
          : "Изтрива отметките, стъпките, порциите и темата. Изборът за статистиката остава."}
      </p>
    </div>
  );
}
