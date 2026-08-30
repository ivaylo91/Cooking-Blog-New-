import type { Metadata } from "next";
import { CategoryFilter } from "@/components/CategoryFilter";
import { RecipeCard } from "@/components/RecipeCard";
import { getCategories, getRecipes } from "@/lib/recipes";

export const metadata: Metadata = {
  title: "Рецепти",
};

export default async function ReceptiPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const [recipes, categories] = await Promise.all([
    getRecipes({ categorySlug: category }),
    getCategories(),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="mb-6 text-2xl font-semibold">Рецепти</h1>
      <CategoryFilter categories={categories} activeSlug={category} />
      {recipes.length === 0 ? (
        <p className="text-zinc-500">Няма намерени рецепти в тази категория.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
}
