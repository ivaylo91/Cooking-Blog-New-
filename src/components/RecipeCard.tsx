import Image from "next/image";
import Link from "next/link";
import { getImageUrl } from "@/lib/images";
import type { RecipeListItem } from "@/lib/recipes";

export function RecipeCard({ recipe }: { recipe: RecipeListItem }) {
  const imageUrl = getImageUrl(recipe.image_path);
  const totalTime = recipe.prep_time_minutes + recipe.cook_time_minutes;

  return (
    <Link
      href={`/recepti/${recipe.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-black/10 transition hover:shadow-md dark:border-white/10"
    >
      <div className="relative aspect-[4/3] w-full bg-zinc-100 dark:bg-zinc-900">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={recipe.title}
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        {recipe.category && (
          <span className="text-xs font-medium uppercase tracking-wide text-amber-700 dark:text-amber-500">
            {recipe.category.name}
          </span>
        )}
        <h3 className="font-semibold leading-snug">{recipe.title}</h3>
        <p className="line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
          {recipe.description}
        </p>
        <div className="mt-auto flex gap-3 pt-2 text-xs text-zinc-500">
          {totalTime > 0 && <span>{totalTime} мин</span>}
          <span>{recipe.servings} порции</span>
          <span>{recipe.difficulty}</span>
        </div>
      </div>
    </Link>
  );
}
