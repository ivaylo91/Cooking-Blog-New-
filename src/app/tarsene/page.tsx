import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { RecipeCard } from "@/components/RecipeCard";
import { inCooksOrder } from "@/lib/categories";
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
    <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 sm:pt-12">
      <h1 className="text-display font-bold leading-[1.05]">
        {query ? `Резултати за „${query}“` : "Търсене"}
      </h1>

      {/* The search lives on the page too, so a miss can be retried here. */}
      <form action="/tarsene" role="search" className="relative mt-6 max-w-2xl">
        <label htmlFor="search-page" className="sr-only">
          Търсене на рецепта
        </label>
        <Search
          size={20}
          className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          id="search-page"
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Например: супа, баница"
          className="h-14 w-full rounded-full bg-surface-muted pl-12 pr-28 text-body outline-none ring-accent transition placeholder:text-muted-foreground focus:ring-2"
        />
        <button
          type="submit"
          className="absolute right-1.5 top-1/2 h-11 -translate-y-1/2 rounded-full bg-accent px-6 font-semibold text-accent-foreground transition-colors hover:bg-accent-strong"
        >
          Търси
        </button>
      </form>

      {query && (
        <p className="mt-6 font-medium text-muted-foreground tabular-nums" aria-live="polite">
          {recipeCount(recipes.length)}
        </p>
      )}

      {query && recipes.length === 0 && (
        <div className="mt-4 rounded-3xl bg-surface-muted p-6 sm:p-8">
          <p className="text-heading font-bold">Няма такава рецепта</p>
          <p className="mt-2 text-muted-foreground">
            Опитайте с по-кратка дума или разгледайте някоя категория:
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {inCooksOrder(categories).map((category) => (
              <li key={category.id}>
                <Link
                  href={`/recepti?category=${category.slug}`}
                  className="flex h-11 items-center rounded-full bg-background px-5 font-medium transition-colors hover:bg-border-subtle"
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
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {recipes.map((recipe, index) => (
              <RecipeCard key={recipe.id} recipe={recipe} priority={index < 3} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
