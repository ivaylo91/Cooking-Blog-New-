import Link from "next/link";
import { ChevronDown, X } from "lucide-react";
import { categoryTint, inCooksOrder } from "@/lib/categories";
import { recipeCount } from "@/lib/format";
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

const chip =
  "flex h-11 shrink-0 items-center whitespace-nowrap rounded-full px-4 font-medium transition-colors";
const chipOn = "bg-foreground text-background";
const chipOff = "bg-surface-muted hover:brightness-95 active:scale-[0.97]";

function Chip({
  href,
  selected,
  tint,
  children,
}: {
  href: string;
  selected: boolean;
  /** A category's food colour for the resting state. */
  tint?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={selected ? "true" : undefined}
      style={!selected && tint ? { backgroundColor: tint } : undefined}
      className={`${chip} ${selected ? chipOn : chipOff}`}
    >
      {children}
    </Link>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <nav aria-label={label} className="flex flex-col gap-2">
      <span className="text-small font-semibold text-muted-foreground">{label}</span>
      <div className="flex flex-wrap gap-2">{children}</div>
    </nav>
  );
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
      {/* One decision up front: which category. A single row that scrolls
          sideways on a phone instead of wrapping into a wall of chips. */}
      <nav aria-label="Категория" className="-mx-4 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
        <ul className="flex gap-2">
          <li>
            <Chip href={buildHref(active, { category: undefined })} selected={!active.category}>
              Всички
            </Chip>
          </li>
          {inCooksOrder(categories).map((category) => {
            const selected = active.category === category.slug;
            return (
              <li key={category.id}>
                <Chip
                  href={buildHref(active, { category: selected ? undefined : category.slug })}
                  selected={selected}
                  tint={categoryTint(category.slug)}
                >
                  {category.name}
                </Chip>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-4 flex flex-wrap items-start gap-x-4 gap-y-3">
        {/* Time and difficulty wait behind one control until they are wanted. */}
        <details open={secondaryCount > 0} className="group w-full sm:w-auto">
          <summary className="flex h-11 w-fit cursor-pointer list-none items-center gap-2 rounded-full border border-border-subtle px-4 font-medium transition-colors hover:bg-surface-muted [&::-webkit-details-marker]:hidden">
            Време и трудност
            {secondaryCount > 0 && (
              <span className="inline-flex size-6 items-center justify-center rounded-full bg-accent text-small font-semibold text-accent-foreground tabular-nums">
                {secondaryCount}
              </span>
            )}
            <ChevronDown size={18} className="transition-transform group-open:rotate-180" />
          </summary>
          <div className="animate-rise mt-3 flex flex-col gap-4 rounded-2xl bg-surface p-4 shadow-card">
            <Group label="Време">
              <Chip href={buildHref(active, { time: undefined })} selected={!active.time}>
                Всички
              </Chip>
              {(Object.keys(TIME_FILTERS) as TimeFilter[]).map((key) => (
                <Chip
                  key={key}
                  href={buildHref(active, { time: active.time === key ? undefined : key })}
                  selected={active.time === key}
                >
                  {TIME_FILTERS[key].label}
                </Chip>
              ))}
            </Group>
            <Group label="Трудност">
              <Chip
                href={buildHref(active, { difficulty: undefined })}
                selected={!active.difficulty}
              >
                Всички
              </Chip>
              {DIFFICULTIES.map((level) => (
                <Chip
                  key={level}
                  href={buildHref(active, {
                    difficulty: active.difficulty === level ? undefined : level,
                  })}
                  selected={active.difficulty === level}
                >
                  <span className="capitalize">{level}</span>
                </Chip>
              ))}
            </Group>
          </div>
        </details>

        {/* The count is always stated, filtered or not. */}
        <div className="flex h-11 items-center gap-4">
          <p className="font-medium text-muted-foreground tabular-nums" aria-live="polite">
            {recipeCount(resultCount)}
          </p>
          {hasAny && (
            <Link
              href="/recepti"
              className="inline-flex h-11 items-center gap-1.5 font-semibold text-link hover:underline"
            >
              <X size={17} />
              Изчисти
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
