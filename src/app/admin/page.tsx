import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { DeleteRecipeButton, PublishToggle } from "@/components/admin/RecipeRowActions";
import type { Category, Recipe } from "@/types/recipe";

export default async function AdminDashboard() {
  const supabase = await createClient();
  const { data: recipes, error } = await supabase
    .from("recipes")
    .select("*, category:categories(*)")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Рецепти</h1>
        <Link
          href="/admin/recipes/new"
          className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-black"
        >
          Нова рецепта
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-black/10 text-zinc-500 dark:border-white/10">
            <tr>
              <th className="py-2 pr-4">Заглавие</th>
              <th className="py-2 pr-4">Категория</th>
              <th className="py-2 pr-4">Публикувана</th>
              <th className="py-2 pr-4" />
            </tr>
          </thead>
          <tbody>
            {((recipes ?? []) as Array<Recipe & { category: Category | null }>).map(
              (recipe) => (
                <tr key={recipe.id} className="border-b border-black/5 dark:border-white/5">
                  <td className="py-3 pr-4">
                    <Link href={`/admin/recipes/${recipe.id}/edit`} className="hover:underline">
                      {recipe.title}
                    </Link>
                  </td>
                  <td className="py-3 pr-4 text-zinc-500">{recipe.category?.name ?? "—"}</td>
                  <td className="py-3 pr-4">
                    <PublishToggle id={recipe.id} published={recipe.published} />
                  </td>
                  <td className="py-3 pr-4 text-right">
                    <DeleteRecipeButton id={recipe.id} title={recipe.title} />
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
        {(recipes ?? []).length === 0 && (
          <p className="py-8 text-center text-zinc-500">Все още няма рецепти.</p>
        )}
      </div>
    </div>
  );
}
