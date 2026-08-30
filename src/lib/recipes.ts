import { createClient } from "@/lib/supabase/server";
import type { Category, Ingredient, Recipe, RecipeWithRelations, Step, Tag } from "@/types/recipe";

export interface RecipeListItem extends Recipe {
  category: Category | null;
}

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("categories").select("*").order("name");
  if (error) throw error;
  return data;
}

export async function getRecipes(options: {
  categorySlug?: string;
  search?: string;
  limit?: number;
} = {}): Promise<RecipeListItem[]> {
  const supabase = await createClient();

  let query = supabase
    .from("recipes")
    .select("*, category:categories(*)")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (options.categorySlug) {
    const { data: category } = await supabase
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

async function getRecipeByColumn(
  column: "slug" | "id",
  value: string
): Promise<RecipeWithRelations | null> {
  const supabase = await createClient();

  const { data: recipe, error } = await supabase
    .from("recipes")
    .select("*, category:categories(*)")
    .eq(column, value)
    .single();

  if (error || !recipe) return null;

  const [{ data: ingredients }, { data: steps }, { data: recipeTags }] = await Promise.all([
    supabase
      .from("ingredients")
      .select("*")
      .eq("recipe_id", recipe.id)
      .order("position"),
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

export function getRecipeBySlug(slug: string): Promise<RecipeWithRelations | null> {
  return getRecipeByColumn("slug", slug);
}

export function getRecipeById(id: string): Promise<RecipeWithRelations | null> {
  return getRecipeByColumn("id", id);
}
