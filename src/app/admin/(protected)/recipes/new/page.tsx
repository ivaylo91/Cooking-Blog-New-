import { RecipeForm } from "@/components/admin/RecipeForm";
import { pageTitle } from "@/components/admin/styles";
import { getCategories } from "@/lib/recipes";

export default async function NewRecipePage() {
  const categories = await getCategories();

  return (
    <div>
      <h1 className={`mb-6 ${pageTitle}`}>Нова рецепта</h1>
      <RecipeForm categories={categories} />
    </div>
  );
}
