import Link from "next/link";
import { X } from "lucide-react";
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

const chipBase =
  "rounded-full border px-4 py-1.5 text-sm font-medium transition whitespace-nowrap";
const chipOn = "border-accent bg-accent text-accent-foreground";
const chipOff = "border-border-subtle hover:border-accent hover:text-accent";

function Chip({
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
      className={`${chipBase} ${selected ? chipOn : chipOff}`}
    >
      {children}
    </Link>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:w-20 sm:shrink-0">
        {label}
      </span>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
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
  const hasAny = Boolean(active.category || active.time || active.difficulty);

  return (
    <div className="mb-8 flex flex-col gap-4">
      <Group label="Категория">
        <Chip href={buildHref(active, { category: undefined })} selected={!active.category}>
          Всички
        </Chip>
        {categories.map((category) => (
          <Chip
            key={category.id}
            href={buildHref(active, {
              category: active.category === category.slug ? undefined : category.slug,
            })}
            selected={active.category === category.slug}
          >
            {category.name}
          </Chip>
        ))}
      </Group>

      <Group label="Време">
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

      {hasAny && (
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span>
            {resultCount === 1 ? "1 рецепта" : `${resultCount} рецепти`}
          </span>
          <Link href="/recepti" className="inline-flex items-center gap-1 text-accent hover:underline">
            <X size={14} />
            Изчисти филтрите
          </Link>
        </div>
      )}
    </div>
  );
}
