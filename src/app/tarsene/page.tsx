import type { Metadata } from "next";
import Link from "next/link";
import { Band } from "@/components/Band";
import { RecipeCard } from "@/components/RecipeCard";
import { SearchField } from "@/components/SearchField";
import { categoryTint, inCooksOrder } from "@/lib/categories";
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
    <>
    <Band tone="peach" as="div" innerClassName="pb-8 pt-8 sm:pb-10 sm:pt-12">
      <h1 className="animate-rise text-display font-bold leading-[1.05]">
        {query ? `Резултати за „${query}“` : "Търсене"}
      </h1>

      {/* The search lives on the page too, so a miss can be retried here. The
          key resets the field when the query in the URL changes. */}
      <SearchField
        key={query}
        id="search-page"
        size="large"
        defaultValue={query}
        className="mt-6 max-w-2xl"
      />
    </Band>
    <div className="mx-auto max-w-6xl px-4 sm:px-6">

      {query && (
        <p className="mt-6 font-medium text-muted-foreground tabular-nums" aria-live="polite">
          {recipeCount(recipes.length)}
        </p>
      )}

      {query && recipes.length === 0 && (
        <div className="animate-rise mt-4 rounded-3xl bg-surface p-6 shadow-card sm:p-8">
          <p className="text-heading font-bold">Няма такава рецепта</p>
          <p className="mt-2 text-muted-foreground">
            Опитайте с по-кратка дума или разгледайте някоя категория:
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {inCooksOrder(categories).map((category) => (
              <li key={category.id}>
                <Link
                  href={`/recepti?category=${category.slug}`}
                  style={{ backgroundColor: categoryTint(category.slug) }}
                  className="flex h-11 items-center rounded-full px-5 font-medium transition-[filter,transform] hover:brightness-95 active:scale-[0.97]"
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
              <RecipeCard key={recipe.id} recipe={recipe} priority={index < 3} index={index} />
            ))}
          </div>
        </>
      )}
    </div>
    </>
  );
}
