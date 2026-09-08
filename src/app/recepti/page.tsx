import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Pagination } from "@/components/Pagination";
import { RecipeCard } from "@/components/RecipeCard";
import { RecipeFilters } from "@/components/RecipeFilters";
import { getCategories, getPagedRecipes } from "@/lib/recipes";
import { DIFFICULTIES, TIME_FILTERS } from "@/types/recipe";
import type { Difficulty, TimeFilter } from "@/types/recipe";

interface ReceptiSearchParams {
  category?: string;
  time?: string;
  difficulty?: string;
  page?: string;
}

/** Only let known values reach the query; anything else is ignored. */
function parseFilters(params: ReceptiSearchParams) {
  const time =
    params.time && params.time in TIME_FILTERS ? (params.time as TimeFilter) : undefined;
  const difficulty = DIFFICULTIES.includes(params.difficulty as Difficulty)
    ? (params.difficulty as Difficulty)
    : undefined;
  const parsedPage = Number(params.page);
  const page = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  return { category: params.category, time, difficulty, page };
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
    // Filtered and paged variants point back at the category page so they are
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

  const [{ recipes, total, page, pageCount }, categories] = await Promise.all([
    getPagedRecipes({
      categorySlug: active.category,
      time: active.time,
      difficulty: active.difficulty,
      page: active.page,
    }),
    getCategories(),
  ]);

  // A page number past the end is a dead URL rather than an empty grid.
  if (total > 0 && active.page > pageCount) {
    notFound();
  }

  function hrefFor(target: number): string {
    const search = new URLSearchParams();
    if (active.category) search.set("category", active.category);
    if (active.time) search.set("time", active.time);
    if (active.difficulty) search.set("difficulty", active.difficulty);
    if (target > 1) search.set("page", String(target));
    const qs = search.toString();
    return qs ? `/recepti?${qs}` : "/recepti";
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="mb-6 font-heading text-3xl font-semibold">Рецепти</h1>
      <RecipeFilters categories={categories} active={active} resultCount={total} />
      {recipes.length === 0 ? (
        <p className="text-muted-foreground">
          Няма рецепти, които отговарят на избраните филтри.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {recipes.map((recipe, index) => (
              <RecipeCard key={recipe.id} recipe={recipe} priority={index < 3} />
            ))}
          </div>
          <Pagination page={page} pageCount={pageCount} hrefFor={hrefFor} />
        </>
      )}
    </div>
  );
}
