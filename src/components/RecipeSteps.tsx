"use client";

import Image from "next/image";
import { Check, RotateCcw } from "lucide-react";
import { rememberCooking } from "@/lib/lastCooked";
import { useStoredSet } from "@/lib/useStoredSet";

export interface RecipeStepView {
  id: string;
  text: string;
  imageUrl: string | null;
}

/**
 * The method. Each step's number is also its state: tap it to mark the step
 * done. The first unfinished step after a finished one carries a marker, so a
 * cook who looked away finds their place again, even after closing the tab.
 */
export function RecipeSteps({
  recipeId,
  slug,
  title,
  steps,
}: {
  recipeId: string;
  slug: string;
  title: string;
  steps: RecipeStepView[];
}) {
  const done = useStoredSet(`done:${recipeId}`);
  const anyDone = done.values.size > 0;
  const resumeId = anyDone ? steps.find((step) => !done.values.has(step.id))?.id : undefined;

  function toggle(id: string, index: number) {
    done.toggle(id);
    rememberCooking(slug, title, done.values.has(id) ? index : index + 1);
  }

  return (
    <div>
      <ol>
        {steps.map((step, index) => {
          const isDone = done.values.has(step.id);
          const isResume = step.id === resumeId;
          return (
            <li
              key={step.id}
              className="grid grid-cols-[auto_1fr] gap-4 border-b border-border-subtle py-5 last:border-b-0"
            >
              <button
                type="button"
                onClick={() => toggle(step.id, index)}
                aria-pressed={isDone}
                aria-label={`Стъпка ${index + 1}: ${isDone ? "изпълнена" : "отбележи като изпълнена"}`}
                className={`flex size-11 items-center justify-center rounded-full text-body font-bold tabular-nums transition-colors ${
                  isDone
                    ? "bg-accent text-accent-foreground"
                    : "bg-surface-muted hover:bg-border-subtle"
                }`}
              >
                {isDone ? <Check size={20} strokeWidth={3} /> : index + 1}
              </button>

              <div className="min-w-0 pt-1.5">
                {isResume && (
                  <span className="mb-2 inline-block rounded-full bg-accent-soft px-3 py-1 text-small font-semibold text-accent print:hidden">
                    Продължете оттук
                  </span>
                )}
                <p
                  className={`max-w-[65ch] text-body leading-relaxed ${
                    isDone ? "text-muted-foreground" : ""
                  }`}
                >
                  {step.text}
                </p>
                {step.imageUrl && (
                  <div className="relative mt-4 aspect-video w-full max-w-md overflow-hidden rounded-2xl print:hidden">
                    <Image
                      src={step.imageUrl}
                      alt={`Стъпка ${index + 1}`}
                      fill
                      sizes="(min-width: 480px) 448px, 100vw"
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      {anyDone && (
        <button
          type="button"
          onClick={done.clear}
          className="mt-3 inline-flex h-11 items-center gap-2 font-semibold text-accent hover:underline print:hidden"
        >
          <RotateCcw size={17} />
          Започни отначало
        </button>
      )}
    </div>
  );
}
