import Link from "next/link";
import { ChevronDown, X } from "lucide-react";
import { inCooksOrder, lidStyle } from "@/lib/categories";
import { DIFFICULTIES, TIME_FILTERS } from "@/types/recipe";
import type { Category, Difficulty, TimeFilter } from "@/types/recipe";

export interface ActiveFilters {
  category?: string;
  time?: TimeFilter;
  difficulty?: Difficulty;
}

/**
 * Builds an href that keeps the other active filters intact, and toggles the
 * one being clicked off when it is already applied.
 */
function buildHref(active: ActiveFilters, change: Partial<ActiveFilters>): string {
  const next: ActiveFilters = { ...active, ...change };
  const params = new URLSearchParams();
  if (next.category) params.set("category", next.category);
  if (next.time) params.set("time", next.time);
  if (next.difficulty) params.set("difficulty", next.difficulty);
  const qs = params.toString();
  return qs ? `/recepti?${qs}` : "/recepti";
}

const tile =
  "flex h-11 shrink-0 items-center gap-2 border-2 border-rule px-3 font-heading text-lg font-bold uppercase tracking-wide whitespace-nowrap transition-colors";

/** A filter option that is plain ink when off and filled when on. */
function Option({
  href,
  selected,
  children,
}: {
  href: string;
  selected: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={selected ? "true" : undefined}
      className={`${tile} ${selected ? "bg-foreground text-background" : "hover:bg-surface-muted"}`}
    >
      {children}
    </Link>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <nav aria-label={label} className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <span className="font-heading text-base font-bold uppercase tracking-[0.12em] text-muted-foreground sm:w-24 sm:shrink-0">
        {label}
      </span>
      <div className="flex flex-wrap gap-2">{children}</div>
    </nav>
  );
}

function recipeCount(n: number) {
  return n === 1 ? "1 рецепта" : `${n} рецепти`;
}

export function RecipeFilters({
  categories,
  active,
  resultCount,
}: {
  categories: Category[];
  active: ActiveFilters;
  resultCount: number;
}) {
  const secondaryCount = Number(Boolean(active.time)) + Number(Boolean(active.difficulty));
  const hasAny = Boolean(active.category || secondaryCount);

  return (
    <div className="mb-8">
      {/* One decision up front: which shelf. A single row that scrolls
          sideways on a phone instead of wrapping into a wall of chips. */}
      <nav aria-label="Категория" className="-mx-4 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
        <ul className="flex gap-2">
          <li>
            <Link
              href={buildHref(active, { category: undefined })}
              aria-current={!active.category ? "true" : undefined}
              className={`${tile} ${!active.category ? "bg-foreground text-background" : "hover:bg-surface-muted"}`}
            >
              Всички
            </Link>
          </li>
          {inCooksOrder(categories).map((category) => {
            const selected = active.category === category.slug;
            return (
              <li key={category.id}>
                <Link
                  href={buildHref(active, { category: selected ? undefined : category.slug })}
                  aria-current={selected ? "true" : undefined}
                  style={lidStyle(category.slug)}
                  className={`${tile} ${
                    selected
                      ? "lid-field bg-[var(--lid)] text-[var(--lid-fg)]"
                      : "hover:bg-surface-muted"
                  }`}
                >
                  {/* The lid colour, shown even when off, so colour teaches the shelf. */}
                  {!selected && (
                    <span aria-hidden="true" className="size-3.5 bg-[var(--lid)] ring-1 ring-rule" />
                  )}
                  {category.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Time and difficulty wait behind one control until they are wanted. */}
      <details open={secondaryCount > 0} className="group mt-4 border-2 border-rule">
        <summary className="flex h-12 cursor-pointer list-none items-center justify-between gap-3 px-3 font-heading text-lg font-bold uppercase tracking-wide [&::-webkit-details-marker]:hidden">
          <span>
            Време и трудност
            {secondaryCount > 0 && (
              <span className="ml-2 inline-flex size-6 items-center justify-center bg-foreground text-sm text-background tabular-nums">
                {secondaryCount}
              </span>
            )}
          </span>
          <ChevronDown
            size={20}
            strokeWidth={2.5}
            className="transition-transform group-open:rotate-180"
          />
        </summary>
        <div className="flex flex-col gap-4 border-t-2 border-rule p-3">
          <Group label="Време">
            <Option href={buildHref(active, { time: undefined })} selected={!active.time}>
              Всички
            </Option>
            {(Object.keys(TIME_FILTERS) as TimeFilter[]).map((key) => (
              <Option
                key={key}
                href={buildHref(active, { time: active.time === key ? undefined : key })}
                selected={active.time === key}
              >
                {TIME_FILTERS[key].label}
              </Option>
            ))}
          </Group>
          <Group label="Трудност">
            <Option href={buildHref(active, { difficulty: undefined })} selected={!active.difficulty}>
              Всички
            </Option>
            {DIFFICULTIES.map((level) => (
              <Option
                key={level}
                href={buildHref(active, {
                  difficulty: active.difficulty === level ? undefined : level,
                })}
                selected={active.difficulty === level}
              >
                {level}
              </Option>
            ))}
          </Group>
        </div>
      </details>

      {/* The count is always stated, filtered or not. */}
      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
        <p className="font-heading text-xl font-bold uppercase tracking-wide tabular-nums" aria-live="polite">
          {recipeCount(resultCount)}
        </p>
        {hasAny && (
          <Link
            href="/recepti"
            className="inline-flex h-11 items-center gap-1.5 font-heading text-lg font-bold uppercase tracking-wide underline-offset-4 hover:underline"
          >
            <X size={18} strokeWidth={2.5} />
            Изчисти филтрите
          </Link>
        )}
      </div>
    </div>
  );
}
