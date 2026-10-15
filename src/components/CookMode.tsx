"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Check, ListChecks, Utensils, X } from "lucide-react";
import { StepTimer } from "@/components/StepTimer";
import { getImageUrl } from "@/lib/images";
import { rememberCooking } from "@/lib/lastCooked";
import { formatQuantity } from "@/lib/quantities";
import { useStoredServings } from "@/lib/servings";
import { useStoredSet } from "@/lib/useStoredSet";
import { extractStepDuration } from "@/lib/timer";
import type { Ingredient, Step } from "@/types/recipe";

const FOCUSABLE =
  'button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Bulgarian inflects nouns, so "каймата" in a step should match "кайма" in the
 * list. Comparing the first few letters of each word is crude but holds up
 * for kitchen nouns, and a missed match only means one less highlight.
 */
function stem(word: string) {
  const w = word.toLowerCase().replace(/[^a-zа-я]/g, "");
  return w.length <= 4 ? w : w.slice(0, Math.max(4, w.length - 2));
}

function usedInStep(ingredient: Ingredient, stepText: string) {
  const words = stepText.toLowerCase().split(/\s+/);
  const keys = ingredient.item.split(/\s+/).map(stem).filter((k) => k.length >= 3);
  return keys.some((key) => words.some((word) => word.replace(/[^a-zа-я]/g, "").startsWith(key)));
}

/**
 * Full-screen, one step at a time, screen kept awake: the recipe as you read
 * it at the stove. It is a modal dialog, so focus moves in and comes back,
 * Escape leaves, the arrow keys turn steps, and the page behind stays still.
 * It remembers the step you were on, and the ingredients are one tap away,
 * with the ones this step uses marked, so checking a quantity never costs
 * your place.
 */
export function CookMode({
  recipeId,
  slug,
  title,
  steps,
  ingredients,
  servings: baseServings,
}: {
  recipeId: string;
  slug: string;
  title: string;
  steps: Step[];
  ingredients: Ingredient[];
  servings: number;
}) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [showIngredients, setShowIngredients] = useState(false);
  // Which way the last step change went, so the new step slides in from that side.
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const titleId = useId();
  const storageKey = `cook:${recipeId}`;

  const { servings, multiplier } = useStoredServings(recipeId, baseServings);
  const checked = useStoredSet(`checked:${recipeId}`);

  const currentStep = steps[index];
  const stepText = currentStep?.text ?? "";
  const stepImageUrl = currentStep?.image_path ? getImageUrl(currentStep.image_path) : null;
  const detectedTimer = useMemo(() => extractStepDuration(stepText), [stepText]);

  const usedNow = useMemo(
    () => new Set(ingredients.filter((i) => usedInStep(i, stepText)).map((i) => i.id)),
    [ingredients, stepText]
  );

  function goTo(next: number) {
    const clamped = Math.max(0, Math.min(steps.length - 1, next));
    setDirection(clamped >= index ? "next" : "prev");
    setIndex(clamped);
    rememberCooking(slug, title, clamped);
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
    rememberCooking(slug, title, start);
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

  function handleTouchStart(e: React.TouchEvent) {
    if (e.touches.length === 1) {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    }
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (!touchStartRef.current || e.changedTouches.length === 0) return;
    const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
    const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
    touchStartRef.current = null;

    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) {
      if (dx < 0 && index < steps.length - 1) {
        goTo(index + 1);
      } else if (dx > 0 && index > 0) {
        goTo(index - 1);
      }
    }
  }

  // Keyboard while open: Escape leaves, arrows turn steps, Tab stays inside.
  useEffect(() => {
    if (!open) return;

    function step(next: number) {
      const clamped = Math.max(0, Math.min(steps.length - 1, next));
      setDirection(clamped >= index ? "next" : "prev");
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
  const primary =
    "flex h-16 items-center justify-center gap-2 rounded-full bg-accent text-body font-semibold text-accent-foreground transition-[background-color,transform] hover:bg-accent-strong active:scale-[0.97]";

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={openCookMode}
        className="flex h-14 w-full items-center justify-center gap-2.5 rounded-full bg-accent px-7 text-body font-semibold text-accent-foreground shadow-card transition-[background-color,transform] hover:bg-accent-strong active:scale-[0.97] sm:w-auto"
      >
        <Utensils size={20} />
        Готви стъпка по стъпка
      </button>

      {open && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="animate-rise fixed inset-0 z-[60] flex flex-col bg-background"
        >
          <div className="flex items-center justify-between gap-3 px-4 pt-4 sm:px-8">
            <h2 id={titleId} className="min-w-0 truncate text-body font-bold">
              {title}
            </h2>
            <button
              type="button"
              onClick={close}
              className="flex size-12 shrink-0 items-center justify-center rounded-full bg-surface-muted"
              aria-label="Затвори режима за готвене"
            >
              <X size={22} />
            </button>
          </div>

          {/* Progress: one segment per step, filled as you go. */}
          <div className="flex gap-1.5 px-4 pt-4 sm:px-8" aria-hidden="true">
            {steps.map((step, i) => (
              <span
                key={step.id}
                className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${i <= index ? "bg-accent" : "bg-surface-muted"}`}
              />
            ))}
          </div>

          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="relative flex flex-1 flex-col overflow-y-auto px-5 py-8 sm:px-12"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p aria-live="polite" className="font-semibold text-muted-foreground tabular-nums">
                Стъпка {index + 1} от {steps.length}
              </p>
              {detectedTimer && (
                <StepTimer
                  key={`${index}-${detectedTimer.seconds}`}
                  initialSeconds={detectedTimer.seconds}
                  label={detectedTimer.label}
                />
              )}
            </div>

            <p
              key={index}
              className={`mt-4 max-w-3xl text-display font-medium leading-snug ${
                direction === "next" ? "animate-slide-next" : "animate-slide-prev"
              }`}
            >
              {stepText}
            </p>

            {stepImageUrl && (
              <div className="relative mt-6 aspect-video w-full max-w-lg overflow-hidden rounded-2xl shadow-card print:hidden">
                <Image
                  src={stepImageUrl}
                  alt={`Стъпка ${index + 1}`}
                  fill
                  sizes="(min-width: 640px) 512px, 100vw"
                  className="object-cover"
                />
              </div>
            )}

            <p className="mt-8 text-small text-muted-foreground sm:hidden">
              Плъзнете наляво/надясно за смяна на стъпка
            </p>

            {showIngredients && (
              <div
                className="animate-rise absolute inset-0 z-10 flex flex-col overflow-y-auto bg-background px-5 py-6 sm:px-12"
                aria-label="Съставки"
                role="region"
              >
                <div className="flex items-center justify-between border-b border-border-subtle pb-4">
                  <div>
                    <p className="text-heading font-bold">
                      Съставки
                      <span className="ml-2 text-body font-medium text-muted-foreground">
                        за {servings} {servings === 1 ? "порция" : "порции"}
                      </span>
                    </p>
                    {usedNow.size > 0 && (
                      <p className="mt-1 text-small text-muted-foreground">
                        Маркираните в цвят са нужни за текущата стъпка.
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowIngredients(false)}
                    className="rounded-full bg-surface-muted px-4 py-2 text-small font-semibold hover:bg-border-subtle"
                  >
                    Към стъпката
                  </button>
                </div>

                <ul className="mt-4 flex-1 pb-10">
                  {ingredients.map((ingredient) => {
                    const used = usedNow.has(ingredient.id);
                    const isChecked = checked.values.has(ingredient.id);
                    return (
                      <li
                        key={ingredient.id}
                        onClick={() => checked.toggle(ingredient.id)}
                        className={`flex cursor-pointer items-center justify-between gap-4 rounded-xl px-3 py-3 text-body transition-colors hover:bg-surface-muted ${
                          used ? "bg-accent-soft/70 font-medium" : ""
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span
                            className={`flex size-6 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
                              isChecked
                                ? "border-accent bg-accent text-accent-foreground"
                                : "border-field-border bg-field"
                            }`}
                          >
                            {isChecked && (
                              <Check size={16} strokeWidth={3} className="animate-pop" />
                            )}
                          </span>
                          <span
                            className={`truncate leading-snug ${
                              isChecked ? "text-muted-foreground line-through" : ""
                            }`}
                          >
                            {ingredient.item}
                            {ingredient.note && (
                              <span className="font-normal text-muted-foreground">
                                {" "}
                                ({ingredient.note})
                              </span>
                            )}
                          </span>
                        </div>

                        <span
                          className={`shrink-0 text-right font-semibold tabular-nums ${
                            isChecked ? "text-muted-foreground line-through" : ""
                          }`}
                        >
                          {formatQuantity(ingredient.amount, ingredient.unit, multiplier)}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>

          <div className="grid grid-cols-[auto_1fr_1fr] gap-2 px-4 pb-5 pt-3 sm:px-8">
            <button
              type="button"
              onClick={() => setShowIngredients((v) => !v)}
              aria-pressed={showIngredients}
              className={`flex h-16 items-center justify-center gap-2 rounded-full px-5 font-semibold transition-colors ${
                showIngredients ? "bg-foreground text-background" : "bg-surface-muted"
              }`}
            >
              <ListChecks size={22} />
              <span className="hidden sm:inline">Съставки</span>
              <span className="sr-only sm:hidden">Съставки</span>
            </button>
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              disabled={index === 0}
              className="flex h-16 items-center justify-center gap-2 rounded-full bg-surface-muted text-body font-semibold disabled:opacity-35"
            >
              <ArrowLeft size={22} /> Назад
            </button>
            {isLast ? (
              <button ref={nextRef} type="button" onClick={close} className={primary}>
                Готово
              </button>
            ) : (
              <button ref={nextRef} type="button" onClick={() => goTo(index + 1)} className={primary}>
                Напред <ArrowRight size={22} />
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
