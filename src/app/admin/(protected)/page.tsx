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
        <h1 className="font-heading text-2xl font-semibold">Рецепти</h1>
        <Link
          href="/admin/recipes/new"
          className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition hover:bg-accent-strong"
        >
          Нова рецепта
        </Link>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border-subtle bg-surface">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border-subtle text-muted-foreground">
            <tr>
              <th className="py-3 pl-4 pr-4">Заглавие</th>
              <th className="py-3 pr-4">Категория</th>
              <th className="py-3 pr-4">Публикувана</th>
              <th className="py-3 pr-4" />
            </tr>
          </thead>
          <tbody>
            {((recipes ?? []) as Array<Recipe & { category: Category | null }>).map(
              (recipe) => (
                <tr key={recipe.id} className="border-b border-border-subtle last:border-0">
                  <td className="py-3 pl-4 pr-4">
                    <Link
                      href={`/admin/recipes/${recipe.id}/edit`}
                      className="font-medium hover:text-accent hover:underline"
                    >
                      {recipe.title}
                    </Link>
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground">
                    {recipe.category?.name ?? "—"}
                  </td>
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
          <p className="py-8 text-center text-muted-foreground">Все още няма рецепти.</p>
        )}
      </div>
    </div>
  );
}
