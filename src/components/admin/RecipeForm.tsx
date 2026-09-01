"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ChevronDown, ClipboardList, ListOrdered, Plus, Sparkles, X } from "lucide-react";
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

const fieldClass =
  "rounded-lg border border-border-subtle bg-background px-3 py-2 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent-soft";
const labelClass = "flex flex-col gap-1.5 text-sm font-medium";
const iconButtonClass =
  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border-subtle text-muted-foreground transition hover:border-destructive hover:text-destructive";
const sectionCardClass = "rounded-2xl border border-border-subtle bg-surface p-6";

function SectionHeading({ icon: Icon, children }: { icon: typeof ClipboardList; children: React.ReactNode }) {
  return (
    <h2 className="mb-5 flex items-center gap-2 font-heading text-lg font-semibold">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-soft text-accent-strong">
        <Icon size={14} />
      </span>
      {children}
    </h2>
  );
}

function Select({
  value,
  onChange,
  children,
}: {
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full appearance-none pr-9 ${fieldClass}`}
      >
        {children}
      </select>
      <ChevronDown
        size={15}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
      />
    </div>
  );
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {error && (
        <p className="rounded-lg border border-destructive-border bg-destructive-soft px-3 py-2 text-sm text-destructive-strong">
          {error}
        </p>
      )}

      <section className={sectionCardClass}>
        <SectionHeading icon={Sparkles}>Основна информация</SectionHeading>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className={`${labelClass} sm:col-span-2`}>
            Заглавие
            <input
              required
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (!slugTouched) setSlug(slugify(e.target.value));
              }}
              className={fieldClass}
            />
          </label>

          <label className={`${labelClass} sm:col-span-2`}>
            Slug (URL)
            <input
              required
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setSlugTouched(true);
              }}
              className={`font-mono text-xs ${fieldClass}`}
            />
          </label>

          <label className={`${labelClass} sm:col-span-2`}>
            Описание
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={fieldClass}
            />
          </label>

          <label className={labelClass}>
            Категория
            <Select value={categoryId ?? ""} onChange={setCategoryId}>
              <option value="">—</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </label>

          <label className={labelClass}>
            Кухня
            <input
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
              className={fieldClass}
            />
          </label>

          <label className={labelClass}>
            Трудност
            <Select value={difficulty} onChange={(v) => setDifficulty(v as Difficulty)}>
              <option value="лесно">лесно</option>
              <option value="средно">средно</option>
              <option value="трудно">трудно</option>
            </Select>
          </label>

          <label className={labelClass}>
            Порции
            <input
              type="number"
              min={1}
              value={servings}
              onChange={(e) => setServings(e.target.value)}
              className={fieldClass}
            />
          </label>

          <label className={labelClass}>
            Подготовка (мин)
            <input
              type="number"
              min={0}
              value={prepTime}
              onChange={(e) => setPrepTime(e.target.value)}
              className={fieldClass}
            />
          </label>

          <label className={labelClass}>
            Готвене (мин)
            <input
              type="number"
              min={0}
              value={cookTime}
              onChange={(e) => setCookTime(e.target.value)}
              className={fieldClass}
            />
          </label>

          <label className={`${labelClass} sm:col-span-2`}>
            Тагове (разделени със запетая)
            <input
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="постно, лятно, без глутен"
              className={fieldClass}
            />
          </label>

          <div className="sm:col-span-2">
            <span className="mb-1.5 block text-sm font-medium">Снимка</span>
            <ImageUpload path={imagePath} onChange={setImagePath} folder="recipes" />
          </div>

          <label className="flex cursor-pointer items-center gap-3 text-sm font-medium sm:col-span-2">
            <span
              className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                published ? "bg-accent" : "bg-border-subtle"
              }`}
            >
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="sr-only"
              />
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                  published ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </span>
            Публикувана
          </label>
        </div>
      </section>

      <section className={sectionCardClass}>
        <SectionHeading icon={ClipboardList}>Продукти</SectionHeading>
        <div className="flex flex-col gap-2">
          {ingredients.map((row, index) => (
            <div
              key={index}
              className="grid grid-cols-12 items-center gap-2 rounded-xl border border-border-subtle bg-background/60 p-2"
            >
              <input
                placeholder="Група (по избор)"
                value={row.group_name}
                onChange={(e) => updateIngredient(index, { group_name: e.target.value })}
                className={`col-span-2 py-1.5 text-sm ${fieldClass}`}
              />
              <input
                placeholder="Кол-во"
                value={row.amount}
                onChange={(e) => updateIngredient(index, { amount: e.target.value })}
                className={`col-span-1 py-1.5 text-sm ${fieldClass}`}
              />
              <input
                placeholder="Мярка"
                value={row.unit}
                onChange={(e) => updateIngredient(index, { unit: e.target.value })}
                className={`col-span-2 py-1.5 text-sm ${fieldClass}`}
              />
              <input
                placeholder="Продукт"
                value={row.item}
                onChange={(e) => updateIngredient(index, { item: e.target.value })}
                className={`col-span-4 py-1.5 text-sm ${fieldClass}`}
              />
              <input
                placeholder="Бележка"
                value={row.note}
                onChange={(e) => updateIngredient(index, { note: e.target.value })}
                className={`col-span-2 py-1.5 text-sm ${fieldClass}`}
              />
              <button
                type="button"
                onClick={() => setIngredients((rows) => rows.filter((_, i) => i !== index))}
                className={`col-span-1 ${iconButtonClass}`}
                aria-label="Премахни продукт"
              >
                <X size={14} />
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
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-border-subtle py-2.5 text-sm font-medium text-accent transition hover:border-accent hover:bg-accent-soft"
        >
          <Plus size={15} />
          Добави продукт
        </button>
      </section>

      <section className={sectionCardClass}>
        <SectionHeading icon={ListOrdered}>Стъпки</SectionHeading>
        <div className="flex flex-col gap-3">
          {steps.map((step, index) => (
            <div key={index} className="flex items-start gap-3">
              <span className="mt-1.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-soft text-xs font-semibold text-accent-strong">
                {index + 1}
              </span>
              <textarea
                rows={2}
                value={step.text}
                onChange={(e) => updateStep(index, { text: e.target.value })}
                className={`flex-1 py-2 text-sm ${fieldClass}`}
              />
              <button
                type="button"
                onClick={() => setSteps((rows) => rows.filter((_, i) => i !== index))}
                className={`mt-1 ${iconButtonClass}`}
                aria-label="Премахни стъпка"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setSteps((rows) => [...rows, { text: "", image_path: null }])}
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-border-subtle py-2.5 text-sm font-medium text-accent transition hover:border-accent hover:bg-accent-soft"
        >
          <Plus size={15} />
          Добави стъпка
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
