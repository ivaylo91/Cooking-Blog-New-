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
        className={`rounded-full border px-4 py-1.5 text-sm ${
          !activeSlug
            ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
            : "border-black/10 hover:bg-black/[.04] dark:border-white/15 dark:hover:bg-white/[.06]"
        }`}
      >
        Всички
      </Link>
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/recepti?category=${category.slug}`}
          className={`rounded-full border px-4 py-1.5 text-sm ${
            activeSlug === category.slug
              ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
              : "border-black/10 hover:bg-black/[.04] dark:border-white/15 dark:hover:bg-white/[.06]"
          }`}
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
}
