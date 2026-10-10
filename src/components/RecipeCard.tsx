import Image from "next/image";
import Link from "next/link";
import { IngredientsIllustration } from "@/components/IngredientsIllustration";
import { SaladIllustration } from "@/components/SaladIllustration";
import { lidStyle } from "@/lib/categories";
import { getImageUrl, getPlaceholderVariant } from "@/lib/images";
import type { RecipeListItem } from "@/lib/recipes";

/**
 * A recipe as a pack facing on the shelf. One strict label grid rules every
 * card: product window, lid stripe with the category, the name, then a ruled
 * run of minutes, portions and difficulty.
 */
export function RecipeCard({
  recipe,
  // Set on the cards above the fold. Those carry the page's LCP, and lazy
  // loading delays the request until layout, which pushes LCP out.
  priority = false,
}: {
  recipe: RecipeListItem;
  priority?: boolean;
}) {
  const imageUrl = getImageUrl(recipe.image_path);
  const totalTime = recipe.prep_time_minutes + recipe.cook_time_minutes;
  const Placeholder =
    getPlaceholderVariant(recipe.id) === "salad" ? SaladIllustration : IngredientsIllustration;
  const rating =
    recipe.rating_count > 0 ? (recipe.rating_sum / recipe.rating_count).toFixed(1) : null;

  return (
    <Link
      href={`/recepti/${recipe.slug}`}
      style={lidStyle(recipe.category?.slug)}
      className="group flex flex-col border-2 border-rule bg-surface transition-colors hover:bg-surface-muted"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden border-b-2 border-rule bg-surface-muted">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt=""
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
            priority={priority}
          />
        ) : (
          <Placeholder />
        )}
      </div>

      {/* Lid stripe: the category's colour, read before the name. */}
      <div className="flex h-8 items-center bg-[var(--lid)] px-3 font-heading text-sm font-extrabold uppercase tracking-[0.12em] text-[var(--lid-fg)]">
        {recipe.category?.name ?? "Рецепта"}
      </div>

      <div className="flex flex-1 flex-col px-3 pb-3 pt-3">
        <h3 className="font-heading text-[1.75rem] font-extrabold uppercase leading-[0.95] tracking-wide group-hover:underline">
          {recipe.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-[0.95rem] leading-snug text-muted-foreground">
          {recipe.description}
        </p>

        <dl className="mt-auto flex items-end divide-x divide-border-subtle border-t-2 border-rule pt-2 font-heading uppercase leading-none tabular-nums">
          {totalTime > 0 && (
            <div className="pr-3">
              <dt className="sr-only">Време</dt>
              <dd className="text-xl font-extrabold">
                {totalTime}
                <span className="ml-1 text-sm font-bold tracking-wide">мин</span>
              </dd>
            </div>
          )}
          <div className="px-3 first:pl-0">
            <dt className="sr-only">Порции</dt>
            <dd className="text-xl font-extrabold">
              {recipe.servings}
              <span className="ml-1 text-sm font-bold tracking-wide">порц.</span>
            </dd>
          </div>
          <div className="px-3">
            <dt className="sr-only">Трудност</dt>
            <dd className="text-sm font-bold tracking-wide">{recipe.difficulty}</dd>
          </div>
          {rating && (
            <div className="ml-auto pl-3">
              <dt className="sr-only">Оценка от 5</dt>
              <dd className="text-sm font-extrabold">{rating}/5</dd>
            </div>
          )}
        </dl>
      </div>
    </Link>
  );
}
