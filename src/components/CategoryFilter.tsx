import Link from "next/link";
import type { Category } from "@/types/recipe";

export function CategoryFilter({
  categories,
  activeSlug,
}: {
  categories: Category[];
  activeSlug?: string;
}) {
  return (
    <div className="mb-8 flex flex-wrap gap-2">
      <Link
        href="/recepti"
        className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
          !activeSlug
            ? "border-accent bg-accent text-accent-foreground"
            : "border-border-subtle hover:border-accent hover:text-accent"
        }`}
      >
        Всички
      </Link>
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/recepti?category=${category.slug}`}
          className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
            activeSlug === category.slug
              ? "border-accent bg-accent text-accent-foreground"
              : "border-border-subtle hover:border-accent hover:text-accent"
          }`}
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
}
