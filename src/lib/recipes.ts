import { cacheLife, cacheTag } from "next/cache";
import { publicClient } from "@/lib/supabase/public";
import { createClient } from "@/lib/supabase/server";
import { TIME_FILTERS } from "@/types/recipe";
import type {
  Category,
  Comment,
  Difficulty,
  Ingredient,
  Recipe,
  RecipeWithRelations,
  Step,
  Tag,
  TimeFilter,
} from "@/types/recipe";

export interface RecipeListItem extends Recipe {
  category: Category | null;
}

/**
 * Explicit column list. `select("*")` also ships `search_vector`, a full-text
 * index blob that is only ever used server-side by the search filter but was
 * about a quarter of the list payload, and `author_id`, which nothing renders.
 */
const RECIPE_COLUMNS =
  "id, slug, title, description, category_id, cuisine, difficulty, " +
  "prep_time_minutes, cook_time_minutes, servings, image_path, published, " +
  "likes_count, rating_sum, rating_count, total_time_minutes, created_at, updated_at";
const RECIPE_SELECT = `${RECIPE_COLUMNS}, category:categories(*)`;

/** Cache tags, invalidated from the admin server actions after a write. */
export const RECIPES_TAG = "recipes";
export const CATEGORIES_TAG = "categories";
export const COMMENTS_TAG = "comments";

export async function getCategories(): Promise<Category[]> {
  "use cache";
  cacheLife("days");
  cacheTag(CATEGORIES_TAG);

  const { data, error } = await publicClient.from("categories").select("*").order("name");
  if (error) throw error;
  return data;
}

export interface RecipeQuery {
  categorySlug?: string;
  search?: string;
  limit?: number;
  sortBy?: "recent" | "likes" | "rating";
  time?: TimeFilter;
  difficulty?: Difficulty;
}

export const RECIPES_PER_PAGE = 12;

export interface PagedRecipes {
  recipes: RecipeListItem[];
  total: number;
  page: number;
  pageCount: number;
}

/**
 * Structural view of the PostgREST builder methods used below. The builder's
 * real generics are deep enough that referring to them here trips TypeScript's
 * recursion limit, so the cast is confined to `applyRecipeFilters`.
 */
interface FilterableQuery {
  eq(column: string, value: unknown): FilterableQuery;
  lte(column: string, value: unknown): FilterableQuery;
  gt(column: string, value: unknown): FilterableQuery;
  order(column: string, options: { ascending: boolean }): FilterableQuery;
  textSearch(
    column: string,
    query: string,
    options: { type: "websearch"; config: string }
  ): FilterableQuery;
}

/**
 * Filtering by category uses an inner join on the embedded resource rather
 * than a separate lookup of the category id, which saves a round trip.
 */
function recipeSelect(options: RecipeQuery): string {
  return options.categorySlug
    ? `${RECIPE_COLUMNS}, category:categories!inner(*)`
    : RECIPE_SELECT;
}

function applyRecipeFilters<Q>(query: Q, options: RecipeQuery): Q {
  const orderColumn =
    options.sortBy === "likes"
      ? "likes_count"
      : options.sortBy === "rating"
        ? "rating_sum"
        : "created_at";

  let q = (query as FilterableQuery)
    .eq("published", true)
    .order(orderColumn, { ascending: false });

  if (options.categorySlug) {
    q = q.eq("category.slug", options.categorySlug);
  }

  if (options.time) {
    const { maxMinutes } = TIME_FILTERS[options.time];
    q = maxMinutes === null
      ? q.gt("total_time_minutes", 60)
      : q.lte("total_time_minutes", maxMinutes);
  }

  if (options.difficulty) {
    q = q.eq("difficulty", options.difficulty);
  }

  if (options.search) {
    q = q.textSearch("search_vector", options.search, {
      type: "websearch",
      config: "simple",
    });
  }

  return q as Q;
}

/**
 * One page of results plus the total, so the listing can render page links.
 * The exact count comes back on the same request rather than a second query.
 */
export async function getPagedRecipes(
  options: RecipeQuery & { page?: number } = {}
): Promise<PagedRecipes> {
  "use cache";
  cacheLife("hours");
  cacheTag(RECIPES_TAG);

  const page = Math.max(1, Math.floor(options.page ?? 1));
  const from = (page - 1) * RECIPES_PER_PAGE;

  const { data, error, count } = await applyRecipeFilters(
    publicClient.from("recipes").select(recipeSelect(options), { count: "exact" }),
    options
  ).range(from, from + RECIPES_PER_PAGE - 1);

  if (error) throw error;

  const total = count ?? 0;
  return {
    recipes: (data ?? []) as unknown as RecipeListItem[],
    total,
    page,
    pageCount: Math.max(1, Math.ceil(total / RECIPES_PER_PAGE)),
  };
}

export async function getRecipes(options: RecipeQuery = {}): Promise<RecipeListItem[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(RECIPES_TAG);

  let query = applyRecipeFilters(
    publicClient.from("recipes").select(recipeSelect(options)),
    options
  );

  if (options.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as unknown as RecipeListItem[];
}

/**
 * Published recipe for the public site, read through the anon key so the page
 * can be prerendered. Unpublished recipes resolve to `null` here by design —
 * the admin reads those through {@link getRecipeById}.
 */
export async function getRecipeBySlug(slug: string): Promise<RecipeWithRelations | null> {
  "use cache";
  cacheLife("hours");
  cacheTag(RECIPES_TAG, `recipe:${slug}`);

  const { data: recipe, error } = await publicClient
    .from("recipes")
    .select(RECIPE_SELECT)
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (error || !recipe) return null;

  const [{ data: ingredients }, { data: steps }, { data: recipeTags }] = await Promise.all([
    publicClient.from("ingredients").select("*").eq("recipe_id", recipe.id).order("position"),
    publicClient.from("steps").select("*").eq("recipe_id", recipe.id).order("position"),
    publicClient.from("recipe_tags").select("tag:tags(*)").eq("recipe_id", recipe.id),
  ]);

  return {
    ...(recipe as unknown as Recipe & { category: Category | null }),
    ingredients: (ingredients ?? []) as Ingredient[],
    steps: (steps ?? []) as Step[],
    tags: ((recipeTags ?? []) as unknown as Array<{ tag: Tag }>).map((rt) => rt.tag),
  };
}

/**
 * Admin-only read. Uses the session-aware client so unpublished drafts are
 * visible, and stays uncached so the edit form never shows stale values.
 */
export async function getRecipeById(id: string): Promise<RecipeWithRelations | null> {
  const supabase = await createClient();

  const { data: recipe, error } = await supabase
    .from("recipes")
    .select(RECIPE_SELECT)
    .eq("id", id)
    .single();

  if (error || !recipe) return null;

  const [{ data: ingredients }, { data: steps }, { data: recipeTags }] = await Promise.all([
    supabase.from("ingredients").select("*").eq("recipe_id", recipe.id).order("position"),
    supabase.from("steps").select("*").eq("recipe_id", recipe.id).order("position"),
    supabase.from("recipe_tags").select("tag:tags(*)").eq("recipe_id", recipe.id),
  ]);

  return {
    ...(recipe as unknown as Recipe & { category: Category | null }),
    ingredients: (ingredients ?? []) as Ingredient[],
    steps: (steps ?? []) as Step[],
    tags: ((recipeTags ?? []) as unknown as Array<{ tag: Tag }>).map((rt) => rt.tag),
  };
}

export async function getRelatedRecipes(
  recipeId: string,
  categoryId: string | null,
  limit = 3
): Promise<RecipeListItem[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(RECIPES_TAG);

  const related: RecipeListItem[] = [];

  if (categoryId) {
    const { data } = await publicClient
      .from("recipes")
      .select(RECIPE_SELECT)
      .eq("published", true)
      .eq("category_id", categoryId)
      .neq("id", recipeId)
      .order("created_at", { ascending: false })
      .limit(limit);
    related.push(...((data ?? []) as unknown as RecipeListItem[]));
  }

  if (related.length < limit) {
    const excludeIds = [recipeId, ...related.map((r) => r.id)];
    const { data } = await publicClient
      .from("recipes")
      .select(RECIPE_SELECT)
      .eq("published", true)
      .not("id", "in", `(${excludeIds.join(",")})`)
      .order("created_at", { ascending: false })
      .limit(limit - related.length);
    related.push(...((data ?? []) as unknown as RecipeListItem[]));
  }

  return related;
}

export async function getRecipeComments(recipeId: string): Promise<Comment[]> {
  // Safe to cache for hours because `addComment` expires this recipe's tag on
  // every successful post, so a new comment shows up immediately.
  "use cache";
  cacheLife("hours");
  cacheTag(COMMENTS_TAG, `comments:${recipeId}`);

  const { data, error } = await publicClient
    .from("comments")
    .select("*")
    .eq("recipe_id", recipeId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

/**
 * Categories that hold at least one published recipe. An empty category is a
 * dead end for a reader, so filters and suggestions offer only these.
 */
export async function getStockedCategories(): Promise<Category[]> {
  const [categories, recipes] = await Promise.all([getCategories(), getRecipes()]);
  const stocked = new Set(recipes.map((recipe) => recipe.category_id));
  return categories.filter((category) => stocked.has(category.id));
}
