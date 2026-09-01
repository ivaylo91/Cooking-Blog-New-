import { RecipeForm } from "@/components/admin/RecipeForm";
import { getCategories } from "@/lib/recipes";

export default async function NewRecipePage() {
  const categories = await getCategories();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Нова рецепта</h1>
      <RecipeForm categories={categories} />
    </div>
  );
}
