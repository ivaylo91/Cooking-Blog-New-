"use client";

import { useSyncExternalStore } from "react";
import { notifyTimerFinished, primeTimerAudio } from "@/lib/timer";

/**
 * Every step timer on the page, in one store, so a timer keeps running when
 * Cook Mode moves to another step and the page and Cook Mode show the same
 * one. Time is counted to a wall-clock end, not by ticks: browsers throttle
 * intervals in background tabs, and a tick count would fall behind.
 */
export interface TimerState {
  id: string;
  label: string;
  durationMs: number;
  /** Set while running. */
  endsAt: number | null;
  /** Kept while paused. */
  remainingMs: number;
  finished: boolean;
}

const timers = new Map<string, TimerState>();
const listeners = new Set<() => void>();
let snapshot: TimerState[] = [];
let ticker: ReturnType<typeof setInterval> | null = null;
let wakeLock: WakeLockSentinel | null = null;

function emit() {
  snapshot = [...timers.values()];
  for (const listener of listeners) listener();
}

function anyRunning() {
  return snapshot.some((timer) => timer.endsAt !== null);
}

/**
 * Finishes every timer whose end has passed, then publishes a fresh snapshot
 * so the countdowns redraw. Runs on each tick and on return to the tab.
 */
function check() {
  const now = Date.now();
  for (const timer of timers.values()) {
    if (timer.endsAt !== null && timer.endsAt <= now) {
      timers.set(timer.id, { ...timer, endsAt: null, remainingMs: 0, finished: true });
      notifyTimerFinished();
    }
  }
  emit();
  sync();
}

/** Starts or stops the ticker and the screen wake lock to match. */
function sync() {
  const running = anyRunning();
  if (running && !ticker) ticker = setInterval(check, 250);
  if (!running && ticker) {
    clearInterval(ticker);
    ticker = null;
  }
  if (running && !wakeLock) requestWakeLock();
  if (!running && wakeLock) {
    wakeLock.release().catch(() => {});
    wakeLock = null;
  }
}

async function requestWakeLock() {
  try {
    if ("wakeLock" in navigator) {
      wakeLock = await navigator.wakeLock.request("screen");
      wakeLock.addEventListener("release", () => {
        wakeLock = null;
      });
    }
  } catch {
    // Battery saver or an unsupported browser: the timer still runs.
  }
}

if (typeof document !== "undefined") {
  // A hidden tab's ticks may stop for a while; catch up the moment it's back,
  // and take the wake lock again, which the browser drops on hide.
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      wakeLock = null;
      check();
    }
  });
}

function update(id: string, change: Partial<TimerState>) {
  const timer = timers.get(id);
  if (!timer) return;
  timers.set(id, { ...timer, ...change });
  emit();
  sync();
}

export const timerActions = {
  start(id: string, label: string, seconds: number) {
    // Called from the Start tap, the gesture iOS needs before it plays sound.
    primeTimerAudio();
    const durationMs = seconds * 1000;
    timers.set(id, {
      id,
      label,
      durationMs,
      endsAt: Date.now() + durationMs,
      remainingMs: durationMs,
      finished: false,
    });
    emit();
    sync();
  },
  pause(id: string) {
    const timer = timers.get(id);
    if (!timer || timer.endsAt === null) return;
    update(id, { endsAt: null, remainingMs: Math.max(0, timer.endsAt - Date.now()) });
  },
  resume(id: string) {
    const timer = timers.get(id);
    if (!timer || timer.endsAt !== null) return;
    primeTimerAudio();
    update(id, { endsAt: Date.now() + timer.remainingMs });
  },
  restart(id: string) {
    const timer = timers.get(id);
    if (!timer) return;
    primeTimerAudio();
    update(id, {
      endsAt: Date.now() + timer.durationMs,
      remainingMs: timer.durationMs,
      finished: false,
    });
  },
  close(id: string) {
    timers.delete(id);
    emit();
    sync();
  },
};

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const empty: TimerState[] = [];

/** All timers; re-renders on every tick while one runs. */
export function useTimers(): TimerState[] {
  return useSyncExternalStore(subscribe, () => snapshot, () => empty);
}

/** Time left in whole seconds, rounded up so "0:00" shows only when done. */
export function secondsLeft(timer: TimerState): number {
  const ms = timer.endsAt !== null ? timer.endsAt - Date.now() : timer.remainingMs;
  return Math.max(0, Math.ceil(ms / 1000));
}
