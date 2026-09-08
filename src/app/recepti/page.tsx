import type { Metadata } from "next";
import { RecipeCard } from "@/components/RecipeCard";
import { RecipeFilters } from "@/components/RecipeFilters";
import { getCategories, getRecipes } from "@/lib/recipes";
import { DIFFICULTIES, TIME_FILTERS } from "@/types/recipe";
import type { Difficulty, TimeFilter } from "@/types/recipe";

interface ReceptiSearchParams {
  category?: string;
  time?: string;
  difficulty?: string;
}

/** Only let known values reach the query; anything else is ignored. */
function parseFilters(params: ReceptiSearchParams) {
  const time =
    params.time && params.time in TIME_FILTERS ? (params.time as TimeFilter) : undefined;
  const difficulty = DIFFICULTIES.includes(params.difficulty as Difficulty)
    ? (params.difficulty as Difficulty)
    : undefined;
  return { category: params.category, time, difficulty };
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<ReceptiSearchParams>;
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
    // Filter combinations point back at the category page so the variants are
    // not indexed as separate near-duplicate pages.
    alternates: { canonical: `/recepti?category=${category.slug}` },
    openGraph: { title: category.name, description },
  };
}

export default async function ReceptiPage({
  searchParams,
}: {
  searchParams: Promise<ReceptiSearchParams>;
}) {
  const params = await searchParams;
  const active = parseFilters(params);

  const [recipes, categories] = await Promise.all([
    getRecipes({
      categorySlug: active.category,
      time: active.time,
      difficulty: active.difficulty,
    }),
    getCategories(),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="mb-6 font-heading text-3xl font-semibold">Рецепти</h1>
      <RecipeFilters categories={categories} active={active} resultCount={recipes.length} />
      {recipes.length === 0 ? (
        <p className="text-muted-foreground">
          Няма рецепти, които отговарят на избраните филтри.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {recipes.map((recipe, index) => (
            <RecipeCard key={recipe.id} recipe={recipe} priority={index < 3} />
          ))}
        </div>
      )}
    </div>
  );
}
