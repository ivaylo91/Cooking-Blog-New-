import Link from "next/link";
import { RecipeCard } from "@/components/RecipeCard";
import { getCategories, getRecipes } from "@/lib/recipes";

export default async function Home() {
  const [recipes, categories] = await Promise.all([
    getRecipes({ limit: 6 }),
    getCategories(),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <section className="mb-12 text-center">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Кулинарният блог на Иво
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-zinc-600 dark:text-zinc-400">
          Домашни рецепти за хобиисти и ентусиасти на готвенето — проверени,
          подробни и лесни за следване.
        </p>
      </section>

      <section className="mb-12 flex flex-wrap justify-center gap-2">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/recepti?category=${category.slug}`}
            className="rounded-full border border-black/10 px-4 py-1.5 text-sm hover:bg-black/[.04] dark:border-white/15 dark:hover:bg-white/[.06]"
          >
            {category.name}
          </Link>
        ))}
      </section>

      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Последни рецепти</h2>
          <Link href="/recepti" className="text-sm hover:underline">
            Всички рецепти →
          </Link>
        </div>
        {recipes.length === 0 ? (
          <p className="text-zinc-500">Все още няма публикувани рецепти.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
