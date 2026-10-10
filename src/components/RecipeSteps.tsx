"use client";

import Image from "next/image";
import { RotateCcw } from "lucide-react";
import { useStoredSet } from "@/lib/useStoredSet";

export interface RecipeStepView {
  id: string;
  text: string;
  imageUrl: string | null;
}

/**
 * The method, printed like the back of a flour bag. Each step's number box is
 * also its state: tap it to mark the step done. The first unfinished step
 * after a finished one carries a tab, so a cook who looked away finds their
 * place again, even after closing the tab and coming back.
 */
export function RecipeSteps({ recipeId, steps }: { recipeId: string; steps: RecipeStepView[] }) {
  const done = useStoredSet(`done:${recipeId}`);
  const anyDone = done.values.size > 0;
  const resumeId = anyDone ? steps.find((step) => !done.values.has(step.id))?.id : undefined;

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
                onClick={() => done.toggle(step.id)}
                aria-pressed={isDone}
                aria-label={`Стъпка ${index + 1}: ${isDone ? "изпълнена" : "отбележи като изпълнена"}`}
                className={`flex size-14 items-center justify-center border-2 border-rule font-heading text-[2rem] font-black leading-none tabular-nums transition-colors print:size-10 print:text-xl ${
                  isDone ? "bg-foreground text-background" : "hover:bg-surface-muted"
                }`}
              >
                {isDone ? (
                  <svg viewBox="0 0 16 16" aria-hidden="true" className="size-7">
                    <path
                      d="M2.5 8.5 L6.5 12.5 L13.5 4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="square"
                    />
                  </svg>
                ) : (
                  index + 1
                )}
              </button>

              <div className="min-w-0">
                {isResume && (
                  <span className="mb-2 inline-block bg-stamp px-2 py-1 font-heading text-sm font-extrabold uppercase tracking-[0.12em] text-white [clip-path:polygon(0_0,100%_0,calc(100%-8px)_50%,100%_100%,0_100%)] pr-4 print:hidden">
                    Продължете оттук
                  </span>
                )}
                <p
                  className={`max-w-[65ch] text-[1.1875rem] leading-relaxed ${
                    isDone ? "text-muted-foreground" : ""
                  }`}
                >
                  {step.text}
                </p>
                {step.imageUrl && (
                  <div className="relative mt-4 aspect-video w-full max-w-md overflow-hidden border-2 border-rule print:hidden">
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
          className="mt-4 inline-flex h-11 items-center gap-2 font-heading text-lg font-bold uppercase tracking-wide underline-offset-4 hover:underline print:hidden"
        >
          <RotateCcw size={18} strokeWidth={2.5} />
          Започни отначало
        </button>
      )}
    </div>
  );
}
