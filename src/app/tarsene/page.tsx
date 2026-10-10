import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { RecipeCard } from "@/components/RecipeCard";
import { inCooksOrder, lidStyle } from "@/lib/categories";
import { getRecipes, getStockedCategories } from "@/lib/recipes";

export const metadata: Metadata = {
  title: "Търсене",
};

function recipeCount(n: number) {
  return n === 1 ? "1 рецепта" : `${n} рецепти`;
}

export default async function TarseneStranica({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const [recipes, categories] = await Promise.all([
    query ? getRecipes({ search: query }) : Promise.resolve([]),
    getStockedCategories(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
      <h1 className="border-b-[3px] border-rule pb-2 font-heading text-[clamp(3rem,13vw,6rem)] font-black uppercase leading-[0.86] tracking-wide [text-wrap:balance]">
        {query ? `„${query}“` : "Търсене"}
      </h1>

      {/* The search lives on the page too, so a miss can be retried here. */}
      <form action="/tarsene" role="search" className="mt-6 flex max-w-2xl">
        <label htmlFor="search-page" className="sr-only">
          Търсене на рецепта
        </label>
        <div className="relative flex-1">
          <Search
            size={20}
            strokeWidth={2.25}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
          />
          <input
            id="search-page"
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Например: супа, баница, без месо"
            className="h-14 w-full border-2 border-r-0 border-rule bg-surface pl-11 pr-3 text-lg outline-none transition-colors placeholder:text-muted-foreground focus:border-accent"
          />
        </div>
        <button
          type="submit"
          className="h-14 bg-foreground px-6 font-heading text-xl font-extrabold uppercase tracking-wide text-background transition-opacity hover:opacity-85"
        >
          Търси
        </button>
      </form>

      {query && (
        <p className="mt-6 font-heading text-xl font-bold uppercase tracking-wide tabular-nums" aria-live="polite">
          {recipeCount(recipes.length)}
        </p>
      )}

      {query && recipes.length === 0 && (
        <div className="mt-4 border-2 border-rule p-5">
          <p className="font-heading text-2xl font-extrabold uppercase tracking-wide">
            Няма такава рецепта на рафта
          </p>
          <p className="mt-2 text-muted-foreground">
            Опитайте с по-кратка дума или разгледайте някоя категория:
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {inCooksOrder(categories).map((category) => (
              <li key={category.id}>
                <Link
                  href={`/recepti?category=${category.slug}`}
                  style={lidStyle(category.slug)}
                  className="lid-field flex h-11 items-center border-2 border-rule bg-[var(--lid)] px-3 font-heading text-lg font-bold uppercase tracking-wide text-[var(--lid-fg)] hover:underline"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {recipes.length > 0 && (
        <>
          <h2 className="sr-only">Резултати</h2>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recipes.map((recipe, index) => (
              <RecipeCard key={recipe.id} recipe={recipe} priority={index < 3} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
