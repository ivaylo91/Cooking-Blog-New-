import Image from "next/image";
import Link from "next/link";
import { ExternalLink, ImageOff, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getImageUrl } from "@/lib/images";
import { DeleteRecipeButton, PublishToggle } from "@/components/admin/RecipeRowActions";
import { pageTitle, primaryButton } from "@/components/admin/styles";
import type { Category, Recipe } from "@/types/recipe";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("bg-BG", { day: "numeric", month: "short", year: "numeric" });
}

export default async function AdminDashboard() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("recipes")
    .select("*, category:categories(*)")
    .order("created_at", { ascending: false });

  if (error) throw error;
  const recipes = (data ?? []) as Array<Recipe & { category: Category | null }>;
  const drafts = recipes.filter((r) => !r.published).length;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className={pageTitle}>Рецепти</h1>
          <p className="text-small text-muted-foreground tabular-nums">
            {recipes.length} общо{drafts > 0 && ` · ${drafts} ${drafts === 1 ? "чернова" : "чернови"}`}
          </p>
        </div>
        <Link href="/admin/recipes/new" className={primaryButton}>
          <Plus size={18} aria-hidden="true" />
          Нова рецепта
        </Link>
      </div>

      {recipes.length === 0 ? (
        <p className="rounded-2xl border border-border-subtle bg-surface py-10 text-center text-muted-foreground">
          Все още няма рецепти.
        </p>
      ) : (
        // Rows rather than a table: the photo tells recipes apart at a glance,
        // and the row reflows on a phone instead of scrolling sideways.
        <ul className="divide-y divide-border-subtle overflow-hidden rounded-2xl border border-border-subtle bg-surface">
          {recipes.map((recipe) => {
            const imageUrl = getImageUrl(recipe.image_path);
            return (
              <li key={recipe.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 p-3 sm:flex-nowrap sm:pr-4">
                <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-surface-muted">
                  {imageUrl ? (
                    <Image src={imageUrl} alt="" fill sizes="56px" className="object-cover" />
                  ) : (
                    <ImageOff size={18} aria-hidden="true" className="absolute inset-0 m-auto text-muted-foreground" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/admin/recipes/${recipe.id}/edit`}
                    className="font-semibold hover:text-link hover:underline"
                  >
                    {recipe.title}
                  </Link>
                  <p className="text-small text-muted-foreground">
                    {recipe.category?.name ?? "Без категория"} · {formatDate(recipe.created_at)}
                  </p>
                </div>
                <div className="flex w-full items-center justify-end gap-1 sm:w-auto">
                  <PublishToggle id={recipe.id} published={recipe.published} />
                  {recipe.published && (
                    <Link
                      href={`/recepti/${recipe.slug}`}
                      target="_blank"
                      aria-label={`Виж „${recipe.title}“ в сайта`}
                      className="flex size-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-surface-muted hover:text-foreground"
                    >
                      <ExternalLink size={17} />
                    </Link>
                  )}
                  <DeleteRecipeButton id={recipe.id} title={recipe.title} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
