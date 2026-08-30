import Image from "next/image";
import Link from "next/link";
import { ChefHat, Clock, Users } from "lucide-react";
import { getImageUrl } from "@/lib/images";
import type { RecipeListItem } from "@/lib/recipes";

export function RecipeCard({ recipe }: { recipe: RecipeListItem }) {
  const imageUrl = getImageUrl(recipe.image_path);
  const totalTime = recipe.prep_time_minutes + recipe.cook_time_minutes;

  return (
    <Link
      href={`/recepti/${recipe.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border-subtle bg-surface shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-muted">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={recipe.title}
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <ChefHat size={32} strokeWidth={1.5} />
          </div>
        )}
        {recipe.category && (
          <span className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-strong backdrop-blur-sm">
            {recipe.category.name}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-heading text-lg font-semibold leading-snug">{recipe.title}</h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">{recipe.description}</p>
        <div className="mt-auto flex gap-4 pt-3 text-xs text-muted-foreground">
          {totalTime > 0 && (
            <span className="flex items-center gap-1">
              <Clock size={13} /> {totalTime} мин
            </span>
          )}
          <span className="flex items-center gap-1">
            <Users size={13} /> {recipe.servings}
          </span>
          <span className="capitalize">{recipe.difficulty}</span>
        </div>
      </div>
    </Link>
  );
}
