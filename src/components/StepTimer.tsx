"use client";

import { Check, Pause, Play, RotateCcw, Timer as TimerIcon, X } from "lucide-react";
import { formatTimeRemaining } from "@/lib/timer";
import { secondsLeft, timerActions, useTimers } from "@/lib/useTimers";

/**
 * A step's timer. Its state lives in the shared timer store under `id`, so
 * the same step shows the same running timer on the page and in Cook Mode,
 * and moving between steps never resets it.
 */
export function StepTimer({
  id,
  initialSeconds,
  label,
  className = "",
}: {
  /** One per step of one recipe, e.g. `${recipeId}:${stepIndex}`. */
  id: string;
  initialSeconds: number;
  label: string;
  className?: string;
}) {
  const timer = useTimers().find((t) => t.id === id);

  if (!timer) {
    return (
      <button
        type="button"
        onClick={() => timerActions.start(id, label, initialSeconds)}
        title={`Стартирай таймер: ${label}`}
        aria-label={`Стартирай таймер: ${label}`}
        className={`inline-flex min-h-11 py-1.5 items-center gap-1.5 rounded-full border border-border-subtle bg-surface px-4 text-small font-semibold text-foreground shadow-card transition-[transform,background-color,border-color] hover:border-accent hover:text-link active:scale-95 ${className}`}
      >
        <TimerIcon size={15} aria-hidden="true" className="text-accent" />
        <span>Таймер: {label}</span>
      </button>
    );
  }

  const running = timer.endsAt !== null;
  const { finished } = timer;

  return (
    <div
      className={`animate-pop inline-flex items-center gap-1 rounded-full border py-0 pl-3.5 pr-0.5 text-small shadow-card transition-colors ${
        finished
          ? "border-secondary bg-secondary-soft text-secondary"
          : "border-accent bg-accent-soft text-foreground"
      } ${className}`}
    >
      <TimerIcon
        size={16}
        aria-hidden="true"
        className={finished ? "text-secondary" : running ? "text-accent" : "text-muted-foreground"}
      />

      {/* role="timer" is not announced on its own; the status below speaks
          once, when time is up, instead of every second. */}
      <span role="timer" aria-label={`Таймер: ${label}`} className="ml-1 font-bold tabular-nums">
        {finished ? "Времето изтече!" : formatTimeRemaining(secondsLeft(timer))}
      </span>
      <span role="status" className="sr-only">
        {finished ? `Времето за „${label}“ изтече.` : ""}
      </span>

      <div className="flex items-center gap-1">
        {finished ? (
          <button
            type="button"
            onClick={() => timerActions.restart(id)}
            aria-label="Рестартирай таймера"
            className="flex size-11 items-center justify-center rounded-full transition-colors hover:bg-surface"
          >
            <RotateCcw size={16} aria-hidden="true" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => (running ? timerActions.pause(id) : timerActions.resume(id))}
            aria-label={running ? "Пауза" : "Продължи"}
            className="flex size-11 items-center justify-center rounded-full transition-colors hover:bg-surface"
          >
            {running ? (
              <Pause size={16} aria-hidden="true" />
            ) : (
              <Play size={16} aria-hidden="true" className="translate-x-0.5" />
            )}
          </button>
        )}

        <button
          type="button"
          onClick={() => timerActions.close(id)}
          aria-label="Затвори таймера"
          className="flex size-11 items-center justify-center rounded-full transition-colors hover:bg-surface"
        >
          {finished ? <Check size={16} aria-hidden="true" /> : <X size={16} aria-hidden="true" />}
        </button>
      </div>
    </div>
  );
}
