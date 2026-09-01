"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Utensils, X } from "lucide-react";
import type { Step } from "@/types/recipe";

export function CookMode({ title, steps }: { title: string; steps: Step[] }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  useEffect(() => {
    if (!open) return;

    async function requestWakeLock() {
      try {
        if ("wakeLock" in navigator) {
          wakeLockRef.current = await navigator.wakeLock.request("screen");
        }
      } catch {
        // wake lock is a nice-to-have — cooking still works without it
      }
    }

    requestWakeLock();

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") requestWakeLock();
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      wakeLockRef.current?.release();
      wakeLockRef.current = null;
    };
  }, [open]);

  if (steps.length === 0) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setIndex(0);
          setOpen(true);
        }}
        className="flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition hover:bg-accent-strong"
      >
        <Utensils size={16} />
        Готви стъпка по стъпка
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex flex-col bg-background">
          <div className="flex items-center justify-between border-b border-border-subtle px-6 py-4">
            <span className="font-heading text-base font-semibold">{title}</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border-subtle hover:border-accent hover:text-accent"
              aria-label="Затвори"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex flex-1 flex-col items-center justify-center px-8 py-10 text-center">
            <span className="mb-6 text-sm font-medium text-muted-foreground">
              Стъпка {index + 1} от {steps.length}
            </span>
            <p className="max-w-2xl text-3xl font-medium leading-snug sm:text-4xl">
              {steps[index].text}
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 border-t border-border-subtle px-6 py-4">
            {steps.map((step, i) => (
              <span
                key={step.id}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-6 bg-accent" : "w-1.5 bg-border-subtle"
                }`}
              />
            ))}
          </div>

          <div className="flex items-center justify-between gap-4 px-6 pb-8 pt-2">
            <button
              type="button"
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
              disabled={index === 0}
              className="flex h-14 flex-1 items-center justify-center gap-2 rounded-full border border-border-subtle text-sm font-semibold disabled:opacity-30"
            >
              <ChevronLeft size={20} /> Назад
            </button>
            {index < steps.length - 1 ? (
              <button
                type="button"
                onClick={() => setIndex((i) => Math.min(steps.length - 1, i + 1))}
                className="flex h-14 flex-1 items-center justify-center gap-2 rounded-full bg-accent text-sm font-semibold text-accent-foreground"
              >
                Напред <ChevronRight size={20} />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-14 flex-1 items-center justify-center gap-2 rounded-full bg-accent text-sm font-semibold text-accent-foreground"
              >
                Готово
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
