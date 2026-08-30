import { notFound } from "next/navigation";
import { RecipeForm } from "@/components/admin/RecipeForm";
import { getCategories, getRecipeById } from "@/lib/recipes";

export default async function EditRecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [recipe, categories] = await Promise.all([getRecipeById(id), getCategories()]);

  if (!recipe) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Редактиране на рецепта</h1>
      <RecipeForm categories={categories} initialRecipe={recipe} />
    </div>
  );
}
