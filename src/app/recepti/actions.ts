"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function addComment(recipeId: string, slug: string, formData: FormData) {
  const authorName = String(formData.get("author_name") ?? "").trim().slice(0, 60);
  const text = String(formData.get("text") ?? "").trim().slice(0, 1000);

  if (!authorName || !text) return;

  const supabase = await createClient();
  const { error } = await supabase
    .from("comments")
    .insert({ recipe_id: recipeId, author_name: authorName, text });

  if (error) throw error;

  revalidatePath(`/recepti/${slug}`);
}
