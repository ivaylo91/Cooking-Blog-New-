import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Pagination } from "@/components/Pagination";
import { RecipeCard } from "@/components/RecipeCard";
import { RecipeFilters } from "@/components/RecipeFilters";
import { getCategories, getPagedRecipes, getStockedCategories } from "@/lib/recipes";
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
    getStockedCategories(),
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
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
      <h1 className="mb-6 border-b-[3px] border-rule pb-2 font-heading text-[clamp(3.5rem,16vw,6rem)] font-black uppercase leading-[0.85] tracking-wide">
        Рецепти
      </h1>
      <RecipeFilters categories={categories} active={active} resultCount={total} />
      {recipes.length === 0 ? (
        <div className="border-2 border-rule p-6">
          <p className="font-heading text-2xl font-extrabold uppercase tracking-wide">
            Празен рафт
          </p>
          <p className="mt-2 text-muted-foreground">
            Няма рецепти, които отговарят на избраните филтри. Махнете някой от тях
            или вижте всички рецепти.
          </p>
        </div>
      ) : (
        <>
          <h2 className="sr-only">Резултати</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
