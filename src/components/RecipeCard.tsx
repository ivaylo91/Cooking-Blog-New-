import Image from "next/image";
import Link from "next/link";
import { Clock, Star } from "lucide-react";
import { IngredientsIllustration } from "@/components/IngredientsIllustration";
import { SaladIllustration } from "@/components/SaladIllustration";
import { categoryTint } from "@/lib/categories";
import { getImageUrl, getPlaceholderVariant } from "@/lib/images";
import type { RecipeListItem } from "@/lib/recipes";

/**
 * A recipe the way a food app lists it: the photo leads at one fixed ratio,
 * the name follows, and a single quiet line carries category and minutes.
 */
export function RecipeCard({
  recipe,
  // Set on the cards above the fold. Those carry the page's LCP, and lazy
  // loading delays the request until layout, which pushes LCP out.
  priority = false,
  size = "default",
  index = 0,
  animate = true,
}: {
  recipe: RecipeListItem;
  priority?: boolean;
  /** "feature" is the large lead card on the home page. */
  size?: "default" | "feature";
  /** Position in its grid, for the entrance stagger (capped so long lists don't wait). */
  index?: number;
  /** Off for grids that re-render on every filter or page change. */
  animate?: boolean;
}) {
  const imageUrl = getImageUrl(recipe.image_path);
  const totalTime = recipe.prep_time_minutes + recipe.cook_time_minutes;
  const Placeholder =
    getPlaceholderVariant(recipe.id) === "salad" ? SaladIllustration : IngredientsIllustration;
  const rating =
    recipe.rating_count > 0 ? (recipe.rating_sum / recipe.rating_count).toFixed(1) : null;
  // The category wears its food colour as a small pill, so the card itself
  // can stay white and let the photo carry the colour. Time and rating are
  // what a reader scans a grid for; servings wait for the recipe page.
  const meta = (
    <>
      {recipe.category?.name && (
        <span
          style={{ backgroundColor: categoryTint(recipe.category.slug) }}
          className="rounded-full px-2.5 py-0.5 font-medium text-foreground"
        >
          {recipe.category.name}
        </span>
      )}
      {totalTime > 0 && (
        <span className="inline-flex items-center gap-1">
          <Clock size={14} aria-hidden="true" />
          {totalTime} мин
        </span>
      )}
      {rating && (
        <span className="inline-flex items-center gap-1">
          <Star size={14} aria-hidden="true" className="fill-current" />
          <span className="sr-only">Оценка </span>
          {rating}
        </span>
      )}
    </>
  );
  const metaRow = "flex flex-wrap items-center gap-x-3 gap-y-1 text-small text-muted-foreground tabular-nums";
  const isFeature = size === "feature";
  // The stagger is capped at six cards so a long grid never makes the reader wait.
  const style = animate ? { animationDelay: `${Math.min(index, 6) * 60}ms` } : undefined;
  const enter = animate ? "animate-rise" : "";
  const lift =
    "bg-surface shadow-card transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-lift active:translate-y-0 motion-reduce:hover:translate-y-0";

  if (isFeature) {
    // The lead story, magazine-style: a 7/5 split with the photo bleeding to
    // the card's edge and the name at display size, so it reads in the first
    // viewport and leaves no empty white beside the image.
    return (
      <Link
        href={`/recepti/${recipe.slug}`}
        style={style}
        className={`${enter} group grid overflow-hidden rounded-3xl md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] ${lift}`}
      >
        <div className="relative aspect-[4/3] w-full md:aspect-auto md:min-h-[26rem]">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt=""
              fill
              sizes="(min-width: 768px) 60vw, 100vw"
              className="object-cover"
              priority={priority}
            />
          ) : (
            <Placeholder />
          )}
        </div>
        <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
          <h3 className="text-display font-bold group-hover:underline">{recipe.title}</h3>
          <p className="mt-3 text-body text-muted-foreground">{recipe.description}</p>
          <p className={`mt-4 ${metaRow}`}>{meta}</p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/recepti/${recipe.slug}`}
      style={style}
      className={`${enter} group flex flex-col overflow-hidden rounded-2xl ${lift}`}
    >
      <div className="relative aspect-[4/3] w-full">
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

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-heading font-bold group-hover:underline">{recipe.title}</h3>
        <p className={`mt-1.5 ${metaRow}`}>{meta}</p>
      </div>
    </Link>
  );
}
