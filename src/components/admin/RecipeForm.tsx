"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createRecipe, updateRecipe } from "@/app/admin/actions";
import { ImageUpload } from "@/components/admin/ImageUpload";
import type { Category, Difficulty, RecipeWithRelations } from "@/types/recipe";

function slugify(value: string): string {
  const map: Record<string, string> = {
    а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ж: "zh", з: "z", и: "i",
    й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r", с: "s",
    т: "t", у: "u", ф: "f", х: "h", ц: "ts", ч: "ch", ш: "sh", щ: "sht",
    ъ: "a", ь: "y", ю: "yu", я: "ya",
  };
  return value
    .toLowerCase()
    .split("")
    .map((ch) => map[ch] ?? ch)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

interface IngredientRow {
  group_name: string;
  amount: string;
  unit: string;
  item: string;
  note: string;
}

interface StepRow {
  text: string;
  image_path: string | null;
}

export function RecipeForm({
  categories,
  initialRecipe,
}: {
  categories: Category[];
  initialRecipe?: RecipeWithRelations;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(initialRecipe?.title ?? "");
  const [slug, setSlug] = useState(initialRecipe?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!initialRecipe);
  const [description, setDescription] = useState(initialRecipe?.description ?? "");
  const [categoryId, setCategoryId] = useState(initialRecipe?.category_id ?? "");
  const [cuisine, setCuisine] = useState(initialRecipe?.cuisine ?? "Българска");
  const [difficulty, setDifficulty] = useState<Difficulty>(initialRecipe?.difficulty ?? "лесно");
  const [prepTime, setPrepTime] = useState(String(initialRecipe?.prep_time_minutes ?? 15));
  const [cookTime, setCookTime] = useState(String(initialRecipe?.cook_time_minutes ?? 0));
  const [servings, setServings] = useState(String(initialRecipe?.servings ?? 4));
  const [imagePath, setImagePath] = useState<string | null>(initialRecipe?.image_path ?? null);
  const [published, setPublished] = useState(initialRecipe?.published ?? false);
  const [tagsInput, setTagsInput] = useState(
    initialRecipe?.tags.map((t) => t.name).join(", ") ?? ""
  );

  const [ingredients, setIngredients] = useState<IngredientRow[]>(
    initialRecipe?.ingredients.map((i) => ({
      group_name: i.group_name,
      amount: i.amount != null ? String(i.amount) : "",
      unit: i.unit,
      item: i.item,
      note: i.note,
    })) ?? [{ group_name: "", amount: "", unit: "", item: "", note: "" }]
  );

  const [steps, setSteps] = useState<StepRow[]>(
    initialRecipe?.steps.map((s) => ({ text: s.text, image_path: s.image_path })) ?? [
      { text: "", image_path: null },
    ]
  );

  function updateIngredient(index: number, patch: Partial<IngredientRow>) {
    setIngredients((rows) => rows.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  function updateStep(index: number, patch: Partial<StepRow>) {
    setSteps((rows) => rows.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const input = {
      slug,
      title,
      description,
      category_id: categoryId || null,
      cuisine,
      difficulty,
      prep_time_minutes: Number(prepTime) || 0,
      cook_time_minutes: Number(cookTime) || 0,
      servings: Number(servings) || 1,
      image_path: imagePath,
      published,
      ingredients: ingredients
        .filter((i) => i.item.trim())
        .map((i) => ({
          group_name: i.group_name,
          amount: i.amount === "" ? null : Number(i.amount),
          unit: i.unit,
          item: i.item,
          note: i.note,
        })),
      steps: steps
        .filter((s) => s.text.trim())
        .map((s) => ({ text: s.text, image_path: s.image_path })),
      tagNames: tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    startTransition(async () => {
      try {
        if (initialRecipe) {
          await updateRecipe(initialRecipe.id, input);
        } else {
          await createRecipe(input);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Нещо се обърка.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      {error && (
        <p className="rounded-lg border border-destructive-border bg-destructive-soft px-3 py-2 text-sm text-destructive-strong">
          {error}
        </p>
      )}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm font-medium sm:col-span-2">
          Заглавие
          <input
            required
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!slugTouched) setSlug(slugify(e.target.value));
            }}
            className="rounded-lg border border-border-subtle bg-background px-3 py-2 outline-none transition focus:border-accent"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-medium sm:col-span-2">
          Slug (URL)
          <input
            required
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugTouched(true);
            }}
            className="rounded-lg border border-border-subtle bg-background px-3 py-2 font-mono text-xs outline-none transition focus:border-accent"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-medium sm:col-span-2">
          Описание
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="rounded-lg border border-border-subtle bg-background px-3 py-2 outline-none transition focus:border-accent"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Категория
          <select
            value={categoryId ?? ""}
            onChange={(e) => setCategoryId(e.target.value)}
            className="rounded-lg border border-border-subtle bg-background px-3 py-2 outline-none transition focus:border-accent"
          >
            <option value="">—</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Кухня
          <input
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)}
            className="rounded-lg border border-border-subtle bg-background px-3 py-2 outline-none transition focus:border-accent"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Трудност
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as Difficulty)}
            className="rounded-lg border border-border-subtle bg-background px-3 py-2 outline-none transition focus:border-accent"
          >
            <option value="лесно">лесно</option>
            <option value="средно">средно</option>
            <option value="трудно">трудно</option>
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Порции
          <input
            type="number"
            min={1}
            value={servings}
            onChange={(e) => setServings(e.target.value)}
            className="rounded-lg border border-border-subtle bg-background px-3 py-2 outline-none transition focus:border-accent"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Подготовка (мин)
          <input
            type="number"
            min={0}
            value={prepTime}
            onChange={(e) => setPrepTime(e.target.value)}
            className="rounded-lg border border-border-subtle bg-background px-3 py-2 outline-none transition focus:border-accent"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Готвене (мин)
          <input
            type="number"
            min={0}
            value={cookTime}
            onChange={(e) => setCookTime(e.target.value)}
            className="rounded-lg border border-border-subtle bg-background px-3 py-2 outline-none transition focus:border-accent"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-medium sm:col-span-2">
          Тагове (разделени със запетая)
          <input
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="постно, лятно, без глутен"
            className="rounded-lg border border-border-subtle bg-background px-3 py-2 outline-none transition focus:border-accent"
          />
        </label>

        <div className="sm:col-span-2">
          <span className="mb-1.5 block text-sm font-medium">Снимка</span>
          <ImageUpload path={imagePath} onChange={setImagePath} folder="recipes" />
        </div>

        <label className="flex items-center gap-2 text-sm font-medium sm:col-span-2">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="accent-accent"
          />
          Публикувана
        </label>
      </section>

      <section>
        <h2 className="mb-3 font-heading text-lg font-semibold">Продукти</h2>
        <div className="flex flex-col gap-2">
          {ingredients.map((row, index) => (
            <div key={index} className="grid grid-cols-12 gap-2">
              <input
                placeholder="Група (по избор)"
                value={row.group_name}
                onChange={(e) => updateIngredient(index, { group_name: e.target.value })}
                className="col-span-2 rounded-lg border border-border-subtle bg-background px-2 py-1.5 text-sm outline-none focus:border-accent"
              />
              <input
                placeholder="Кол-во"
                value={row.amount}
                onChange={(e) => updateIngredient(index, { amount: e.target.value })}
                className="col-span-1 rounded-lg border border-border-subtle bg-background px-2 py-1.5 text-sm outline-none focus:border-accent"
              />
              <input
                placeholder="Мярка"
                value={row.unit}
                onChange={(e) => updateIngredient(index, { unit: e.target.value })}
                className="col-span-2 rounded-lg border border-border-subtle bg-background px-2 py-1.5 text-sm outline-none focus:border-accent"
              />
              <input
                placeholder="Продукт"
                value={row.item}
                onChange={(e) => updateIngredient(index, { item: e.target.value })}
                className="col-span-4 rounded-lg border border-border-subtle bg-background px-2 py-1.5 text-sm outline-none focus:border-accent"
              />
              <input
                placeholder="Бележка"
                value={row.note}
                onChange={(e) => updateIngredient(index, { note: e.target.value })}
                className="col-span-2 rounded-lg border border-border-subtle bg-background px-2 py-1.5 text-sm outline-none focus:border-accent"
              />
              <button
                type="button"
                onClick={() => setIngredients((rows) => rows.filter((_, i) => i !== index))}
                className="col-span-1 text-sm text-destructive"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() =>
            setIngredients((rows) => [
              ...rows,
              { group_name: "", amount: "", unit: "", item: "", note: "" },
            ])
          }
          className="mt-2 text-sm text-accent hover:underline"
        >
          + Добави продукт
        </button>
      </section>

      <section>
        <h2 className="mb-3 font-heading text-lg font-semibold">Стъпки</h2>
        <div className="flex flex-col gap-3">
          {steps.map((step, index) => (
            <div key={index} className="flex gap-2">
              <span className="pt-2 text-sm text-muted-foreground">{index + 1}.</span>
              <textarea
                rows={2}
                value={step.text}
                onChange={(e) => updateStep(index, { text: e.target.value })}
                className="flex-1 rounded-lg border border-border-subtle bg-background px-3 py-2 text-sm outline-none focus:border-accent"
              />
              <button
                type="button"
                onClick={() => setSteps((rows) => rows.filter((_, i) => i !== index))}
                className="text-sm text-destructive"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setSteps((rows) => [...rows, { text: "", image_path: null }])}
          className="mt-2 text-sm text-accent hover:underline"
        >
          + Добави стъпка
        </button>
      </section>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-accent-foreground transition hover:bg-accent-strong disabled:opacity-50"
        >
          {isPending ? "Запазване..." : "Запази"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin")}
          className="rounded-full border border-border-subtle px-5 py-2 text-sm transition hover:border-accent hover:text-accent"
        >
          Отказ
        </button>
      </div>
    </form>
  );
}
