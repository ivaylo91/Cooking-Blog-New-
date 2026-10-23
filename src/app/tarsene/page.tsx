import type { Metadata } from "next";
import Link from "next/link";
import { Band } from "@/components/Band";
import { RecipeCard } from "@/components/RecipeCard";
import { SearchField } from "@/components/SearchField";
import { categoryTint, inCooksOrder } from "@/lib/categories";
import { recipeCount } from "@/lib/format";
import { getRecipes, getStockedCategories } from "@/lib/recipes";
import type { Category } from "@/types/recipe";

export const metadata: Metadata = {
  title: "Търсене",
};

/** The shelves as chips: a way in when there is nothing, or nothing found, to show. */
function CategoryChips({ categories }: { categories: Category[] }) {
  return (
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
  );
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
    <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">

      {query && (
        <p className="mt-6 font-medium text-muted-foreground tabular-nums" aria-live="polite">
          {recipeCount(recipes.length)}
        </p>
      )}

      {query && recipes.length === 0 && (
        <div className="animate-rise mt-4 rounded-3xl bg-surface p-6 shadow-card sm:p-8">
          <p className="font-heading text-heading font-bold">Няма такава рецепта</p>
          <p className="mt-2 text-muted-foreground">
            Опитайте с по-кратка дума или разгледайте някоя категория:
          </p>
          <CategoryChips categories={categories} />
        </div>
      )}

      {/* Before a search, the page still offers a way in. */}
      {!query && categories.length > 0 && (
        <section aria-labelledby="browse-head" className="mt-8">
          <h2 id="browse-head" className="text-heading font-bold">
            Или разгледайте по категория
          </h2>
          <CategoryChips categories={categories} />
        </section>
      )}

      {recipes.length > 0 && (
        <>
          <h2 className="sr-only">Резултати</h2>
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {recipes.map((recipe, index) => (
              <RecipeCard key={recipe.id} recipe={recipe} priority={index < 3} animate={false} />
            ))}
          </div>
          {/* A short list leaves the page empty below; offer the shelves. */}
          {recipes.length < 3 && categories.length > 0 && (
            <section aria-labelledby="more-head" className="mt-14">
              <h2 id="more-head" className="text-heading font-bold">
                Разгледайте и по категория
              </h2>
              <CategoryChips categories={categories} />
            </section>
          )}
        </>
      )}
    </div>
    </>
  );
}
