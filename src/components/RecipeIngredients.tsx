"use client";

import { useMemo, useState } from "react";
import { Minus, Plus } from "lucide-react";
import type { Ingredient } from "@/types/recipe";

/** Units you count out whole: half an onion is real, a third of one is not. */
const COUNTABLE = new Set([
  "бр",
  "скилидка",
  "скилидки",
  "глава",
  "глави",
  "пакетче",
  "пакетчета",
  "кутия",
  "кутии",
]);
const SPOONS = new Set(["с.л.", "ч.л."]);
const MASS = new Set(["г", "мл"]);

const decimal = (value: number) =>
  value.toFixed(1).replace(/\.0$/, "").replace(".", ",");

const toHalves = (value: number, min: number) =>
  decimal(Math.max(min, Math.round(value * 2) / 2));

/**
 * Scaled quantities have to stay cookable. Plain rounding turns 6→8 portions
 * into "1,33 бр лук" and "1333,33 г картофи", which no recipe has ever said,
 * so each family of units rounds the way a cook would write it.
 */
function formatAmount(amount: number, unit: string): { amount: string; unit: string } {
  if (COUNTABLE.has(unit)) {
    return { amount: toHalves(amount, 1), unit };
  }

  if (SPOONS.has(unit)) {
    return { amount: toHalves(amount, 0.5), unit };
  }

  if (MASS.has(unit)) {
    // Past a kilo or a litre, switch unit rather than print four digits.
    if (amount >= 1000) {
      return { amount: decimal(amount / 1000), unit: unit === "г" ? "кг" : "л" };
    }
    const step = amount < 100 ? 5 : 10;
    return { amount: String(Math.max(step, Math.round(amount / step) * step)), unit };
  }

  // Unknown unit: keep it coarse rather than inventing precision.
  return { amount: toHalves(amount, 0.5), unit };
}

function groupByName(ingredients: Ingredient[]) {
  const groups = new Map<string, Ingredient[]>();
  for (const ingredient of ingredients) {
    const key = ingredient.group_name || "";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(ingredient);
  }
  return Array.from(groups.entries());
}

export function RecipeIngredients({
  ingredients,
  baseServings,
}: {
  ingredients: Ingredient[];
  baseServings: number;
}) {
  const [servings, setServings] = useState(baseServings);
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const multiplier = servings / baseServings;
  // Past double the written recipe the timings and pan sizes stop holding, so
  // the stepper stops rather than quietly producing a dish that won't work.
  const maxServings = baseServings * 2;
  const groups = useMemo(() => groupByName(ingredients), [ingredients]);

  function toggle(id: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="print:mt-0">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3 border-b border-border-subtle pb-3">
        <h2 className="font-heading text-xl font-semibold">Продукти</h2>
        <div className="flex items-center gap-2 print:hidden">
          <button
            type="button"
            onClick={() => setServings((s) => Math.max(1, s - 1))}
            disabled={servings <= 1}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-border-subtle transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border-subtle disabled:hover:text-foreground"
            aria-label="Намали порциите"
          >
            <Minus size={13} />
          </button>
          <span className="w-16 text-center text-sm text-muted-foreground">
            {servings} {servings === 1 ? "порция" : "порции"}
          </span>
          <button
            type="button"
            onClick={() => setServings((s) => Math.min(maxServings, s + 1))}
            disabled={servings >= maxServings}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-border-subtle transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border-subtle disabled:hover:text-foreground"
            aria-label="Увеличи порциите"
          >
            <Plus size={13} />
          </button>
        </div>
      </div>

      {groups.map(([groupName, items]) => (
        <div key={groupName} className="mb-4 last:mb-0">
          {groupName && (
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {groupName}
            </h3>
          )}
          <ul className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
            {items.map((ingredient) => {
              const isChecked = checked.has(ingredient.id);
              return (
                <li key={ingredient.id}>
                  <label className="flex cursor-pointer items-baseline gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggle(ingredient.id)}
                      className="h-3.5 w-3.5 shrink-0 translate-y-0.5 rounded border-border-subtle text-accent accent-accent print:hidden"
                    />
                    <span className={isChecked ? "text-muted-foreground line-through" : ""}>
                      <span className="font-semibold">
                        {ingredient.amount != null
                          ? (() => {
                              const scaled = formatAmount(
                                ingredient.amount * multiplier,
                                ingredient.unit
                              );
                              return `${scaled.amount} ${scaled.unit}`.trim();
                            })()
                          : ingredient.unit}
                      </span>{" "}
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
    </div>
  );
}
