"use client";

import { useMemo, useState } from "react";
import { Minus, Plus, RotateCcw } from "lucide-react";
import { formatQuantity } from "@/lib/quantities";
import { useStoredSet } from "@/lib/useStoredSet";
import type { Ingredient } from "@/types/recipe";

function groupByName(ingredients: Ingredient[]) {
  const groups = new Map<string, Ingredient[]>();
  for (const ingredient of ingredients) {
    const key = ingredient.group_name || "";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(ingredient);
  }
  return Array.from(groups.entries());
}

const stepButton =
  "flex size-11 items-center justify-center border-2 border-rule transition-colors hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent";

/**
 * The "Съставки" panel of the label. Quantities are the loudest thing on it,
 * set like a net weight, and each row is a full-width tap target so a wet
 * finger can tick it off.
 */
export function RecipeIngredients({
  recipeId,
  ingredients,
  baseServings,
}: {
  recipeId: string;
  ingredients: Ingredient[];
  baseServings: number;
}) {
  const [servings, setServings] = useState(baseServings);
  const checked = useStoredSet(`checked:${recipeId}`);
  const multiplier = servings / baseServings;
  // Past double the written recipe the timings and pan sizes stop holding, so
  // the stepper stops rather than quietly producing a dish that won't work.
  const maxServings = baseServings * 2;
  const groups = useMemo(() => groupByName(ingredients), [ingredients]);

  return (
    <section id="sastavki" aria-labelledby="sastavki-head" className="print:mt-0">
      <h2
        id="sastavki-head"
        className="border-b-[3px] border-rule pb-2 font-heading text-[2.75rem] font-extrabold uppercase leading-[0.9] tracking-wide"
      >
        Съставки
      </h2>

      <div className="flex items-center justify-between gap-3 border-b-2 border-rule py-3 print:hidden">
        <span className="font-heading text-lg font-bold uppercase tracking-wide">Порции</span>
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => setServings((s) => Math.max(1, s - 1))}
            disabled={servings <= 1}
            className={stepButton}
            aria-label="Намали порциите"
          >
            <Minus size={20} strokeWidth={2.75} />
          </button>
          <output
            aria-live="polite"
            className="flex h-11 min-w-14 items-center justify-center border-y-2 border-rule px-2 font-heading text-3xl font-black tabular-nums"
          >
            {servings}
          </output>
          <button
            type="button"
            onClick={() => setServings((s) => Math.min(maxServings, s + 1))}
            disabled={servings >= maxServings}
            className={stepButton}
            aria-label="Увеличи порциите"
          >
            <Plus size={20} strokeWidth={2.75} />
          </button>
        </div>
      </div>

      {groups.map(([groupName, items]) => (
        <div key={groupName} className="mt-4">
          {groupName && (
            <h3 className="mb-1 font-heading text-base font-extrabold uppercase tracking-[0.12em] text-muted-foreground">
              {groupName}
            </h3>
          )}
          <ul>
            {items.map((ingredient) => {
              const isChecked = checked.values.has(ingredient.id);
              return (
                <li key={ingredient.id} className="border-b border-border-subtle last:border-b-0">
                  <label className="flex min-h-14 cursor-pointer items-center gap-3 py-2">
                    <span className="relative grid size-6 shrink-0 place-items-center print:hidden">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => checked.toggle(ingredient.id)}
                        className="peer absolute inset-0 size-6 cursor-pointer appearance-none border-2 border-rule bg-surface checked:bg-foreground"
                      />
                      <svg
                        viewBox="0 0 16 16"
                        aria-hidden="true"
                        className="pointer-events-none relative hidden size-4 text-background peer-checked:block"
                      >
                        <path
                          d="M2.5 8.5 L6.5 12.5 L13.5 4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.75"
                          strokeLinecap="square"
                        />
                      </svg>
                    </span>
                    <span
                      className={`min-w-[5.25rem] shrink-0 font-heading text-[1.4rem] font-extrabold leading-none tabular-nums ${
                        isChecked ? "text-muted-foreground line-through decoration-2" : ""
                      }`}
                    >
                      {formatQuantity(ingredient.amount, ingredient.unit, multiplier)}
                    </span>
                    <span className={`leading-snug ${isChecked ? "text-muted-foreground" : ""}`}>
                      {ingredient.item}
                      {ingredient.note && (
                        <span className="text-muted-foreground"> ({ingredient.note})</span>
                      )}
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      ))}

      {checked.values.size > 0 && (
        <button
          type="button"
          onClick={checked.clear}
          className="mt-4 inline-flex h-11 items-center gap-2 font-heading text-lg font-bold uppercase tracking-wide underline-offset-4 hover:underline print:hidden"
        >
          <RotateCcw size={18} strokeWidth={2.5} />
          Махни отметките
        </button>
      )}
    </section>
  );
}
