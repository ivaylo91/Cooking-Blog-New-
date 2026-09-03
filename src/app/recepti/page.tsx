import type { Metadata } from "next";
import { CategoryFilter } from "@/components/CategoryFilter";
import { RecipeCard } from "@/components/RecipeCard";
import { getCategories, getRecipes } from "@/lib/recipes";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}): Promise<Metadata> {
  const { category: categorySlug } = await searchParams;
  if (!categorySlug) {
    return { title: "Рецепти", alternates: { canonical: "/recepti" } };
  }

  const categories = await getCategories();
  const category = categories.find((c) => c.slug === categorySlug);
  if (!category) {
    return { title: "Рецепти", alternates: { canonical: "/recepti" } };
  }

  const description = `Рецепти в категория ${category.name} — Кулинарният блог на Иво.`;
  return {
    title: category.name,
    description,
    alternates: { canonical: `/recepti?category=${category.slug}` },
    openGraph: { title: category.name, description },
  };
}

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
      <h1 className="mb-6 font-heading text-3xl font-semibold">Рецепти</h1>
      <CategoryFilter categories={categories} activeSlug={category} />
      {recipes.length === 0 ? (
        <p className="text-muted-foreground">Няма намерени рецепти в тази категория.</p>
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
