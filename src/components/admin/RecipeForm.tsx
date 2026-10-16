"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { ArrowDown, ArrowUp, ChevronDown, ClipboardList, ListOrdered, Plus, Sparkles, X } from "lucide-react";
import { createRecipe, updateRecipe } from "@/app/admin/actions";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { primaryButton, secondaryButton } from "@/components/admin/styles";
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

// Rows carry a stable key so reordering moves the inputs (and a step's upload
// state) with their content instead of reusing them by position.
interface IngredientRow {
  key: string;
  group_name: string;
  amount: string;
  unit: string;
  item: string;
  note: string;
}

interface StepRow {
  key: string;
  text: string;
  image_path: string | null;
}

// The site's shared field treatment (3:1 border, focus ring). Body-size text
// also keeps iOS from zooming the page whenever a field takes focus.
const fieldClass = "field px-3 py-2.5 text-body";
const labelClass = "flex flex-col gap-1.5 font-semibold";
const iconButtonClass =
  "flex size-10 shrink-0 items-center justify-center rounded-full border border-border-subtle text-muted-foreground transition-colors hover:border-destructive hover:text-destructive disabled:opacity-30 disabled:hover:border-border-subtle disabled:hover:text-muted-foreground";
const sectionCardClass = "rounded-2xl border border-border-subtle bg-surface p-4 sm:p-6";

const newKey = () => crypto.randomUUID();
const emptyIngredient = (): IngredientRow => ({
  key: newKey(),
  group_name: "",
  amount: "",
  unit: "",
  item: "",
  note: "",
});
const emptyStep = (): StepRow => ({ key: newKey(), text: "", image_path: null });

function SectionHeading({ icon: Icon, children }: { icon: typeof ClipboardList; children: React.ReactNode }) {
  return (
    <h2 className="mb-5 flex items-center gap-2 text-heading font-bold">
      <span className="flex size-8 items-center justify-center rounded-full bg-accent-soft text-accent-strong">
        <Icon size={16} />
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
    () =>
      initialRecipe?.ingredients.map((i) => ({
        key: i.id,
        group_name: i.group_name,
        amount: i.amount != null ? String(i.amount) : "",
        unit: i.unit,
        item: i.item,
        note: i.note,
      })) ?? [emptyIngredient()]
  );

  const [steps, setSteps] = useState<StepRow[]>(
    () =>
      initialRecipe?.steps.map((s) => ({ key: s.id, text: s.text, image_path: s.image_path })) ?? [
        emptyStep(),
      ]
  );

  // Unsaved changes: everything the form holds, compared with how it opened.
  const snapshot = JSON.stringify([
    title, slug, description, categoryId, cuisine, difficulty, prepTime, cookTime,
    servings, imagePath, published, tagsInput, ingredients, steps,
  ]);
  const [savedSnapshot] = useState(snapshot);
  const dirty = snapshot !== savedSnapshot && !isPending;

  useEffect(() => {
    if (!dirty) return;
    function onBeforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault();
    }
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  function cancel() {
    if (dirty && !confirm("Имате незапазени промени. Да се откажа ли от тях?")) return;
    router.push("/admin");
  }

  function updateIngredient(index: number, patch: Partial<IngredientRow>) {
    setIngredients((rows) => rows.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  function moveIngredient(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= ingredients.length) return;
    setIngredients((rows) => {
      const next = [...rows];
      const temp = next[index];
      next[index] = next[target];
      next[target] = temp;
      return next;
    });
  }

  function updateStep(index: number, patch: Partial<StepRow>) {
    setSteps((rows) => rows.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  function moveStep(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= steps.length) return;
    setSteps((rows) => {
      const next = [...rows];
      const temp = next[index];
      next[index] = next[target];
      next[target] = temp;
      return next;
    });
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
              className={`font-mono ${fieldClass}`}
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
            <span className="mb-1.5 block font-semibold">Снимка</span>
            <ImageUpload path={imagePath} onChange={setImagePath} folder="recipes" />
          </div>

          <label className="flex min-h-11 cursor-pointer items-center gap-3 font-semibold sm:col-span-2">
            {/* The real checkbox is visually hidden, so the track shows its focus. */}
            <span
              className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent ${
                published ? "bg-accent" : "bg-field-border"
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
              key={row.key}
              className="flex flex-col gap-2 rounded-xl border border-border-subtle bg-background/60 p-3 md:grid md:grid-cols-12 md:items-center md:gap-2 md:p-2"
            >
              <div className="flex md:col-span-2">
                <input
                  placeholder="Група (по избор)"
                  aria-label={`Продукт ${index + 1}: група`}
                  value={row.group_name}
                  onChange={(e) => updateIngredient(index, { group_name: e.target.value })}
                  className={fieldClass}
                />
              </div>
              <div className="grid grid-cols-2 gap-2 md:col-span-3">
                <input
                  placeholder="Кол-во"
                  aria-label={`Продукт ${index + 1}: количество`}
                  inputMode="decimal"
                  value={row.amount}
                  onChange={(e) => updateIngredient(index, { amount: e.target.value })}
                  className={fieldClass}
                />
                <input
                  placeholder="Мярка"
                  aria-label={`Продукт ${index + 1}: мярка`}
                  value={row.unit}
                  onChange={(e) => updateIngredient(index, { unit: e.target.value })}
                  className={fieldClass}
                />
              </div>
              <div className="flex md:col-span-4">
                <input
                  placeholder="Продукт *"
                  aria-label={`Продукт ${index + 1}: име`}
                  value={row.item}
                  onChange={(e) => updateIngredient(index, { item: e.target.value })}
                  className={fieldClass}
                />
              </div>
              <div className="flex items-center gap-2 md:col-span-3">
                <input
                  placeholder="Бележка (по избор)"
                  aria-label={`Продукт ${index + 1}: бележка`}
                  value={row.note}
                  onChange={(e) => updateIngredient(index, { note: e.target.value })}
                  className={`min-w-0 flex-1 ${fieldClass}`}
                />
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => moveIngredient(index, -1)}
                    className={iconButtonClass}
                    aria-label="Премести продукт нагоре"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    type="button"
                    disabled={index === ingredients.length - 1}
                    onClick={() => moveIngredient(index, 1)}
                    className={iconButtonClass}
                    aria-label="Премести продукт надолу"
                  >
                    <ArrowDown size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIngredients((rows) => rows.filter((_, i) => i !== index))}
                    className={iconButtonClass}
                    aria-label="Премахни продукт"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() =>
            setIngredients((rows) => [...rows, emptyIngredient()])
          }
          className="mt-3 flex h-12 w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-field-border font-semibold text-link transition-colors hover:border-accent hover:bg-accent-soft"
        >
          <Plus size={15} />
          Добави продукт
        </button>
      </section>

      <section className={sectionCardClass}>
        <SectionHeading icon={ListOrdered}>Стъпки</SectionHeading>
        <div className="flex flex-col gap-3">
          {steps.map((step, index) => (
            <div
              key={step.key}
              className="flex flex-col gap-2 rounded-xl border border-border-subtle bg-background/60 p-3 sm:flex-row sm:items-start sm:border-0 sm:bg-transparent sm:p-0"
            >
              <div className="flex items-center justify-between gap-2 sm:justify-start">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent-soft font-bold text-accent-strong tabular-nums">
                  {index + 1}
                </span>
                <div className="flex items-center gap-1 sm:hidden">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => moveStep(index, -1)}
                    className={iconButtonClass}
                    aria-label="Премести стъпка нагоре"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    type="button"
                    disabled={index === steps.length - 1}
                    onClick={() => moveStep(index, 1)}
                    className={iconButtonClass}
                    aria-label="Премести стъпка надолу"
                  >
                    <ArrowDown size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setSteps((rows) => rows.filter((_, i) => i !== index))}
                    className={iconButtonClass}
                    aria-label="Премахни стъпка"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
              <textarea
                rows={3}
                aria-label={`Стъпка ${index + 1}`}
                value={step.text}
                onChange={(e) => updateStep(index, { text: e.target.value })}
                className={`min-w-0 flex-1 resize-y ${fieldClass}`}
              />
              <ImageUpload
                size="compact"
                path={step.image_path}
                onChange={(path) => updateStep(index, { image_path: path })}
                folder="steps"
              />
              <div className="hidden sm:mt-1 sm:flex sm:items-center sm:gap-1">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => moveStep(index, -1)}
                  className={iconButtonClass}
                  aria-label="Премести стъпка нагоре"
                >
                  <ArrowUp size={14} />
                </button>
                <button
                  type="button"
                  disabled={index === steps.length - 1}
                  onClick={() => moveStep(index, 1)}
                  className={iconButtonClass}
                  aria-label="Премести стъпка надолу"
                >
                  <ArrowDown size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setSteps((rows) => rows.filter((_, i) => i !== index))}
                  className={iconButtonClass}
                  aria-label="Премахни стъпка"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setSteps((rows) => [...rows, emptyStep()])}
          className="mt-3 flex h-12 w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-field-border font-semibold text-link transition-colors hover:border-accent hover:bg-accent-soft"
        >
          <Plus size={15} />
          Добави стъпка
        </button>
      </section>

      {/* Save stays in reach on a long recipe, and a failed save reports
          right beside the button that was pressed. */}
      <div className="sticky bottom-0 z-10 -mx-4 flex flex-wrap items-center gap-3 border-t border-border-subtle bg-background/90 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6">
        <button type="submit" disabled={isPending} className={primaryButton}>
          {isPending ? "Запазване…" : "Запази"}
        </button>
        <button type="button" onClick={cancel} className={secondaryButton}>
          Отказ
        </button>
        <p aria-live="polite" className="min-w-0 flex-1 text-small font-medium">
          {error ? (
            <span className="text-destructive-strong">{error}</span>
          ) : (
            dirty && <span className="text-muted-foreground">Незапазени промени</span>
          )}
        </p>
      </div>
    </form>
  );
}
