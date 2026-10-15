"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Pause, Play, RotateCcw, Timer as TimerIcon, X } from "lucide-react";
import { formatTimeRemaining, notifyTimerFinished } from "@/lib/timer";

export function StepTimer({
  initialSeconds,
  label,
  className = "",
}: {
  initialSeconds: number;
  label: string;
  className?: string;
}) {
  const [active, setActive] = useState(false);
  const [running, setRunning] = useState(false);
  const [remaining, setRemaining] = useState(initialSeconds);
  const [finished, setFinished] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (running && remaining > 0) {
      intervalRef.current = setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            setRunning(false);
            setFinished(true);
            notifyTimerFinished();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, remaining]);

  function start() {
    setActive(true);
    setRemaining(initialSeconds);
    setFinished(false);
    setRunning(true);
  }

  function togglePlay() {
    if (finished) {
      setRemaining(initialSeconds);
      setFinished(false);
      setRunning(true);
    } else {
      setRunning((prev) => !prev);
    }
  }

  function reset() {
    setRunning(false);
    setRemaining(initialSeconds);
    setFinished(false);
  }

  function close() {
    setRunning(false);
    setActive(false);
    setFinished(false);
    setRemaining(initialSeconds);
  }

  if (!active) {
    return (
      <button
        type="button"
        onClick={start}
        title={`Стартирай таймер: ${label}`}
        aria-label={`Стартирай таймер: ${label}`}
        className={`inline-flex h-9 items-center gap-1.5 rounded-full border border-border-subtle bg-surface px-3 text-small font-semibold text-foreground shadow-sm transition-[transform,background-color,border-color] hover:border-accent hover:text-link active:scale-95 ${className}`}
      >
        <TimerIcon size={15} className="text-accent" />
        <span>Таймер: {label}</span>
      </button>
    );
  }

  return (
    <div
      role="timer"
      aria-live="polite"
      className={`animate-pop inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-small shadow-card transition-colors ${
        finished
          ? "border-secondary bg-secondary-soft text-secondary"
          : "border-accent bg-accent-soft text-foreground"
      } ${className}`}
    >
      <TimerIcon
        size={16}
        className={finished ? "text-secondary" : running ? "animate-pulse text-accent" : "text-muted-foreground"}
      />

      <span className="font-bold tabular-nums">
        {finished ? "Времето изтече!" : formatTimeRemaining(remaining)}
      </span>

      <div className="flex items-center gap-1">
        {finished ? (
          <button
            type="button"
            onClick={reset}
            aria-label="Рестартирай таймера"
            className="flex size-7 items-center justify-center rounded-full bg-surface transition-colors hover:bg-background"
          >
            <RotateCcw size={13} />
          </button>
        ) : (
          <button
            type="button"
            onClick={togglePlay}
            aria-label={running ? "Пауза" : "Продължи"}
            className="flex size-7 items-center justify-center rounded-full bg-surface transition-colors hover:bg-background"
          >
            {running ? <Pause size={13} /> : <Play size={13} className="translate-x-0.5" />}
          </button>
        )}

        <button
          type="button"
          onClick={close}
          aria-label="Затвори таймера"
          className="flex size-7 items-center justify-center rounded-full bg-surface transition-colors hover:bg-background"
        >
          {finished ? <Check size={13} /> : <X size={13} />}
        </button>
      </div>
    </div>
  );
}

