"use client";

import { useMemo } from "react";
import { Check, Minus, Plus, RotateCcw } from "lucide-react";
import { rememberCooking } from "@/lib/lastCooked";
import { formatQuantity } from "@/lib/quantities";
import { useStoredServings } from "@/lib/servings";
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
  "flex size-11 items-center justify-center rounded-full bg-surface shadow-card transition-[transform,opacity] hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:scale-100";

/**
 * The ingredient list. Quantities lead each row, and the whole row is the tap
 * target so a wet finger can tick it off. Ticks survive switching apps.
 */
export function RecipeIngredients({
  recipeId,
  slug,
  title,
  ingredients,
  baseServings,
}: {
  recipeId: string;
  slug: string;
  title: string;
  ingredients: Ingredient[];
  baseServings: number;
}) {
  const { servings, setServings, multiplier, maxServings } = useStoredServings(
    recipeId,
    baseServings
  );
  const checked = useStoredSet(`checked:${recipeId}`);
  const groups = useMemo(() => groupByName(ingredients), [ingredients]);

  function toggle(id: string) {
    checked.toggle(id);
    rememberCooking(slug, title);
  }

  return (
    <section id="sastavki" aria-labelledby="sastavki-head" className="print:mt-0">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="sastavki-head" className="sr-only text-heading font-bold md:not-sr-only">
          Съставки
        </h2>
        <div className="flex items-center gap-1 print:hidden">
          <button
            type="button"
            onClick={() => setServings((s) => Math.max(1, s - 1))}
            disabled={servings <= 1}
            className={stepButton}
            aria-label="Намали порциите"
          >
            <Minus size={18} />
          </button>
          <output aria-live="polite" className="min-w-24 text-center font-semibold tabular-nums">
            {servings} {servings === 1 ? "порция" : "порции"}
          </output>
          <button
            type="button"
            onClick={() => setServings((s) => Math.min(maxServings, s + 1))}
            disabled={servings >= maxServings}
            className={stepButton}
            aria-label="Увеличи порциите"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      {groups.map(([groupName, items]) => (
        <div key={groupName} className="mt-5">
          {groupName && (
            <h3 className="mb-1 text-small font-semibold text-muted-foreground">{groupName}</h3>
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
                        onChange={() => toggle(ingredient.id)}
                        className="peer absolute inset-0 size-6 cursor-pointer appearance-none rounded-md border-2 transition-colors checked:border-accent checked:bg-accent transition-[background-color,border-color,transform] active:scale-90 border-field-border bg-field"
                      />
                      <Check
                        size={16}
                        strokeWidth={3}
                        aria-hidden="true"
                        className="animate-pop pointer-events-none relative hidden text-accent-foreground peer-checked:block"
                      />
                    </span>
                    <span
                      className={`min-w-[4.75rem] shrink-0 font-semibold tabular-nums transition-colors ${
                        isChecked ? "text-muted-foreground line-through" : ""
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
          className="mt-3 inline-flex h-11 items-center gap-2 font-semibold text-link hover:underline print:hidden"
        >
          <RotateCcw size={17} />
          Махни отметките
        </button>
      )}
    </section>
  );
}
