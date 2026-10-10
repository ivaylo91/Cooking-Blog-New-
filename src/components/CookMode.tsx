"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ListChecks, Utensils, X } from "lucide-react";
import { lidStyle } from "@/lib/categories";
import { formatQuantity } from "@/lib/quantities";
import type { Ingredient, Step } from "@/types/recipe";

const FOCUSABLE =
  'button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Full-screen, one step at a time, screen kept awake: the recipe as you read
 * it at the stove. It is a modal dialog, so focus moves in and comes back,
 * Escape leaves, the arrow keys turn steps, and the page behind stays still.
 * It remembers the step you were on, and the ingredients are one tap away
 * so checking a quantity never costs your place.
 */
export function CookMode({
  recipeId,
  title,
  steps,
  ingredients,
  servings,
  categorySlug,
}: {
  recipeId: string;
  title: string;
  steps: Step[];
  ingredients: Ingredient[];
  servings: number;
  categorySlug: string | null | undefined;
}) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [showIngredients, setShowIngredients] = useState(false);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const storageKey = `cook:${recipeId}`;

  function goTo(next: number) {
    const clamped = Math.max(0, Math.min(steps.length - 1, next));
    setIndex(clamped);
    try {
      localStorage.setItem(storageKey, String(clamped));
    } catch {
      // Blocked storage only means the place isn't remembered next time.
    }
  }

  function openCookMode() {
    let start = 0;
    try {
      const saved = Number(localStorage.getItem(storageKey));
      if (Number.isInteger(saved) && saved >= 0 && saved < steps.length) start = saved;
    } catch {
      // Start from the first step.
    }
    setIndex(start);
    setShowIngredients(false);
    setOpen(true);
  }

  function close() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  // Keep the screen awake while cooking, and re-acquire after it comes back.
  useEffect(() => {
    if (!open) return;

    async function requestWakeLock() {
      try {
        if ("wakeLock" in navigator) {
          wakeLockRef.current = await navigator.wakeLock.request("screen");
        }
      } catch {
        // wake lock is a nice-to-have: cooking still works without it
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

  // Modal behaviour on open: lock the page behind and move focus in.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    nextRef.current?.focus();
    return () => {
      root.style.overflow = previousOverflow;
    };
  }, [open]);

  // Keyboard while open: Escape leaves, arrows turn steps, Tab stays inside.
  useEffect(() => {
    if (!open) return;

    function step(next: number) {
      const clamped = Math.max(0, Math.min(steps.length - 1, next));
      setIndex(clamped);
      try {
        localStorage.setItem(storageKey, String(clamped));
      } catch {
        // Blocked storage only means the place isn't remembered next time.
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        if (showIngredients) setShowIngredients(false);
        else {
          setOpen(false);
          triggerRef.current?.focus();
        }
        return;
      }
      if (!showIngredients && event.key === "ArrowRight") {
        event.preventDefault();
        step(index + 1);
        return;
      }
      if (!showIngredients && event.key === "ArrowLeft") {
        event.preventDefault();
        step(index - 1);
        return;
      }
      if (event.key === "Tab" && dialogRef.current) {
        const focusable = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)
        ).filter((el) => el.offsetParent !== null);
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, showIngredients, index, steps.length, storageKey]);

  if (steps.length === 0) return null;

  const isLast = index === steps.length - 1;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={openCookMode}
        className="flex h-14 w-full items-center justify-center gap-2.5 bg-brand px-6 font-heading text-xl font-extrabold uppercase tracking-wide text-white transition-colors hover:bg-[#172f91] sm:w-auto"
      >
        <Utensils size={22} strokeWidth={2.5} />
        Готви стъпка по стъпка
      </button>

      {open && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="fixed inset-0 z-[60] flex flex-col bg-background"
        >
          {/* The lid band: which dish, in its category's colour. */}
          <div
            style={lidStyle(categorySlug)}
            className="lid-field flex items-center justify-between gap-3 border-b-[3px] border-rule bg-[var(--lid)] px-4 py-2 text-[var(--lid-fg)] sm:px-6"
          >
            <h2
              id={titleId}
              className="min-w-0 truncate font-heading text-2xl font-extrabold uppercase tracking-wide"
            >
              {title}
            </h2>
            <button
              type="button"
              onClick={close}
              className="flex size-12 shrink-0 items-center justify-center border-2 border-current"
              aria-label="Затвори режима за готвене"
            >
              <X size={24} strokeWidth={2.5} />
            </button>
          </div>

          {/* Progress: one ruled cell per step, filled as you go. */}
          <div className="flex gap-1 border-b-2 border-rule px-4 py-2 sm:px-6" aria-hidden="true">
            {steps.map((step, i) => (
              <span
                key={step.id}
                className={`h-2 flex-1 border border-rule ${i <= index ? "bg-foreground" : ""}`}
              />
            ))}
          </div>

          <div className="relative flex flex-1 flex-col overflow-y-auto px-5 py-8 sm:px-10">
            <p
              aria-live="polite"
              className="font-heading text-xl font-extrabold uppercase tracking-[0.12em] tabular-nums"
            >
              Стъпка {index + 1} от {steps.length}
            </p>
            <p className="mt-4 max-w-3xl text-[1.85rem] font-medium leading-snug sm:text-[2.4rem]">
              {steps[index].text}
            </p>

            {showIngredients && (
              <div
                className="absolute inset-0 overflow-y-auto bg-background px-5 py-6 sm:px-10"
                aria-label="Съставки"
                role="region"
              >
                <div className="border-b-[3px] border-rule pb-2">
                  <p className="font-heading text-3xl font-extrabold uppercase tracking-wide">
                    Съставки
                    <span className="ml-3 text-lg font-bold text-muted-foreground">
                      за {servings} порции
                    </span>
                  </p>
                </div>
                <ul className="mt-2">
                  {ingredients.map((ingredient) => (
                    <li
                      key={ingredient.id}
                      className="flex items-baseline gap-4 border-b border-border-subtle py-3 text-xl"
                    >
                      <span className="min-w-[6rem] shrink-0 font-heading text-2xl font-extrabold tabular-nums">
                        {formatQuantity(ingredient.amount, ingredient.unit)}
                      </span>
                      <span>{ingredient.item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="grid grid-cols-[auto_1fr_1fr] gap-2 border-t-[3px] border-rule px-4 py-4 sm:px-6">
            <button
              type="button"
              onClick={() => setShowIngredients((v) => !v)}
              aria-pressed={showIngredients}
              className={`flex h-16 items-center justify-center gap-2 border-2 border-rule px-4 font-heading text-lg font-extrabold uppercase tracking-wide ${
                showIngredients ? "bg-foreground text-background" : ""
              }`}
            >
              <ListChecks size={22} strokeWidth={2.5} />
              <span className="hidden sm:inline">Съставки</span>
              <span className="sr-only sm:hidden">Съставки</span>
            </button>
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              disabled={index === 0}
              className="flex h-16 items-center justify-center gap-2 border-2 border-rule font-heading text-xl font-extrabold uppercase tracking-wide disabled:opacity-30"
            >
              <ArrowLeft size={24} strokeWidth={2.5} /> Назад
            </button>
            {isLast ? (
              <button
                ref={nextRef}
                type="button"
                onClick={close}
                className="flex h-16 items-center justify-center gap-2 bg-brand font-heading text-xl font-extrabold uppercase tracking-wide text-white"
              >
                Готово
              </button>
            ) : (
              <button
                ref={nextRef}
                type="button"
                onClick={() => goTo(index + 1)}
                className="flex h-16 items-center justify-center gap-2 bg-brand font-heading text-xl font-extrabold uppercase tracking-wide text-white"
              >
                Напред <ArrowRight size={24} strokeWidth={2.5} />
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
