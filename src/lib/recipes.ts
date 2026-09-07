import { cacheLife, cacheTag } from "next/cache";
import { publicClient } from "@/lib/supabase/public";
import { createClient } from "@/lib/supabase/server";
import type { Category, Comment, Ingredient, Recipe, RecipeWithRelations, Step, Tag } from "@/types/recipe";

export interface RecipeListItem extends Recipe {
  category: Category | null;
}

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

export async function getRecipes(options: {
  categorySlug?: string;
  search?: string;
  limit?: number;
  sortBy?: "recent" | "likes";
} = {}): Promise<RecipeListItem[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(RECIPES_TAG);

  let query = publicClient
    .from("recipes")
    .select("*, category:categories(*)")
    .eq("published", true)
    .order(options.sortBy === "likes" ? "likes_count" : "created_at", { ascending: false });

  if (options.categorySlug) {
    const { data: category } = await publicClient
      .from("categories")
      .select("id")
      .eq("slug", options.categorySlug)
      .single();
    if (!category) return [];
    query = query.eq("category_id", category.id);
  }

  if (options.search) {
    query = query.textSearch("search_vector", options.search, {
      type: "websearch",
      config: "simple",
    });
  }

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
    .select("*, category:categories(*)")
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
    .select("*, category:categories(*)")
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
      .select("*, category:categories(*)")
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
      .select("*, category:categories(*)")
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
