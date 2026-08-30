"use client";

import { useMemo, useState } from "react";
import { Minus, Plus } from "lucide-react";
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
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const multiplier = servings / baseServings;
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
    <div className="rounded-2xl border border-border-subtle bg-surface p-5 print:border-none print:p-0">
      <div className="mb-5 flex items-center justify-between">
        <span className="font-heading text-lg font-semibold">Продукти</span>
        <div className="flex items-center gap-2 print:hidden">
          <button
            type="button"
            onClick={() => setServings((s) => Math.max(1, s - 1))}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-border-subtle hover:border-accent hover:text-accent"
            aria-label="Намали порциите"
          >
            <Minus size={13} />
          </button>
          <span className="w-16 text-center text-sm text-muted-foreground">
            {servings} {servings === 1 ? "порция" : "порции"}
          </span>
          <button
            type="button"
            onClick={() => setServings((s) => s + 1)}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-border-subtle hover:border-accent hover:text-accent"
            aria-label="Увеличи порциите"
          >
            <Plus size={13} />
          </button>
        </div>
      </div>

      {groups.map(([groupName, items]) => (
        <div key={groupName} className="mb-5 last:mb-0">
          {groupName && (
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {groupName}
            </h3>
          )}
          <ul className="space-y-2.5">
            {items.map((ingredient) => {
              const isChecked = checked.has(ingredient.id);
              return (
                <li key={ingredient.id}>
                  <label className="flex cursor-pointer items-start gap-3 text-sm">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggle(ingredient.id)}
                      className="mt-0.5 h-4 w-4 shrink-0 rounded border-border-subtle text-accent accent-accent print:hidden"
                    />
                    <span className={isChecked ? "text-muted-foreground line-through" : ""}>
                      <span className="font-medium text-accent-strong">
                        {ingredient.amount != null
                          ? `${formatAmount(ingredient.amount * multiplier)} ${ingredient.unit}`
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
