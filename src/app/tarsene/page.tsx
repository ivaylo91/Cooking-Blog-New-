import type { Metadata } from "next";
import { RecipeCard } from "@/components/RecipeCard";
import { getRecipes } from "@/lib/recipes";

export const metadata: Metadata = {
  title: "Търсене",
};

export default async function TarseneStranica({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const recipes = q ? await getRecipes({ search: q }) : [];

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="mb-6 font-heading text-3xl font-semibold">
        {q ? `Резултати за „${q}“` : "Търсене на рецепти"}
      </h1>
      {q && recipes.length === 0 && (
        <p className="text-muted-foreground">Няма намерени рецепти.</p>
      )}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}
