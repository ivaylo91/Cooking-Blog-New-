"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { RecipeFormInput } from "@/types/recipe";

export async function login(formData: FormData) {
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/admin/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/admin");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

async function replaceIngredientsAndSteps(recipeId: string, input: RecipeFormInput) {
  const supabase = await createClient();

  await supabase.from("ingredients").delete().eq("recipe_id", recipeId);
  await supabase.from("steps").delete().eq("recipe_id", recipeId);
  await supabase.from("recipe_tags").delete().eq("recipe_id", recipeId);

  if (input.ingredients.length > 0) {
    const { error } = await supabase.from("ingredients").insert(
      input.ingredients.map((ingredient, index) => ({
        recipe_id: recipeId,
        position: index,
        group_name: ingredient.group_name,
        amount: ingredient.amount,
        unit: ingredient.unit,
        item: ingredient.item,
        note: ingredient.note,
      }))
    );
    if (error) throw error;
  }

  if (input.steps.length > 0) {
    const { error } = await supabase.from("steps").insert(
      input.steps.map((step, index) => ({
        recipe_id: recipeId,
        position: index,
        text: step.text,
        image_path: step.image_path,
      }))
    );
    if (error) throw error;
  }

  if (input.tagNames.length > 0) {
    const tagIds: string[] = [];
    for (const name of input.tagNames) {
      const trimmed = name.trim();
      if (!trimmed) continue;
      const { data: existing } = await supabase
        .from("tags")
        .select("id")
        .eq("name", trimmed)
        .maybeSingle();
      if (existing) {
        tagIds.push(existing.id);
      } else {
        const { data: created, error } = await supabase
          .from("tags")
          .insert({ name: trimmed })
          .select("id")
          .single();
        if (error) throw error;
        tagIds.push(created.id);
      }
    }
    if (tagIds.length > 0) {
      const { error } = await supabase
        .from("recipe_tags")
        .insert(tagIds.map((tagId) => ({ recipe_id: recipeId, tag_id: tagId })));
      if (error) throw error;
    }
  }
}

export async function createRecipe(input: RecipeFormInput) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: recipe, error } = await supabase
    .from("recipes")
    .insert({
      slug: input.slug,
      title: input.title,
      description: input.description,
      category_id: input.category_id,
      cuisine: input.cuisine,
      difficulty: input.difficulty,
      prep_time_minutes: input.prep_time_minutes,
      cook_time_minutes: input.cook_time_minutes,
      servings: input.servings,
      image_path: input.image_path,
      published: input.published,
      author_id: user?.id,
    })
    .select("id")
    .single();

  if (error) throw error;

  await replaceIngredientsAndSteps(recipe.id, input);

  revalidatePath("/");
  revalidatePath("/recepti");
  redirect("/admin");
}

export async function updateRecipe(id: string, input: RecipeFormInput) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("recipes")
    .update({
      slug: input.slug,
      title: input.title,
      description: input.description,
      category_id: input.category_id,
      cuisine: input.cuisine,
      difficulty: input.difficulty,
      prep_time_minutes: input.prep_time_minutes,
      cook_time_minutes: input.cook_time_minutes,
      servings: input.servings,
      image_path: input.image_path,
      published: input.published,
    })
    .eq("id", id);

  if (error) throw error;

  await replaceIngredientsAndSteps(id, input);

  revalidatePath("/");
  revalidatePath("/recepti");
  revalidatePath(`/recepti/${input.slug}`);
  redirect("/admin");
}

export async function deleteRecipe(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("recipes").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/recepti");
}

export async function togglePublish(id: string, published: boolean) {
  const supabase = await createClient();
  const { error } = await supabase.from("recipes").update({ published }).eq("id", id);
  if (error) throw error;
  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/recepti");
}

export async function deleteComment(id: string, slug: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("comments").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/admin/comments");
  revalidatePath(`/recepti/${slug}`);
}
