"use client";

import { useMemo, useState } from "react";
import type { Ingredient } from "@/types/recipe";

function formatAmount(amount: number): string {
  const rounded = Math.round(amount * 100) / 100;
  return rounded.toString().replace(".", ",");
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
  const multiplier = servings / baseServings;
  const groups = useMemo(() => groupByName(ingredients), [ingredients]);

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <span className="text-sm text-zinc-500">Порции:</span>
        <button
          type="button"
          onClick={() => setServings((s) => Math.max(1, s - 1))}
          className="h-8 w-8 rounded-full border border-black/15 hover:bg-black/[.04] dark:border-white/20 dark:hover:bg-white/[.08]"
          aria-label="Намали порциите"
        >
          −
        </button>
        <span className="w-6 text-center font-medium">{servings}</span>
        <button
          type="button"
          onClick={() => setServings((s) => s + 1)}
          className="h-8 w-8 rounded-full border border-black/15 hover:bg-black/[.04] dark:border-white/20 dark:hover:bg-white/[.08]"
          aria-label="Увеличи порциите"
        >
          +
        </button>
      </div>

      {groups.map(([groupName, items]) => (
        <div key={groupName} className="mb-4">
          {groupName && (
            <h3 className="mb-2 text-sm font-semibold text-zinc-500">{groupName}</h3>
          )}
          <ul className="space-y-1.5">
            {items.map((ingredient) => (
              <li key={ingredient.id} className="flex gap-2 text-sm">
                <span className="w-20 shrink-0 text-zinc-500">
                  {ingredient.amount != null
                    ? `${formatAmount(ingredient.amount * multiplier)} ${ingredient.unit}`
                    : ingredient.unit}
                </span>
                <span>
                  {ingredient.item}
                  {ingredient.note && (
                    <span className="text-zinc-500"> ({ingredient.note})</span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
