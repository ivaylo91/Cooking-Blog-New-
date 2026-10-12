import Image from "next/image";
import Link from "next/link";
import { IngredientsIllustration } from "@/components/IngredientsIllustration";
import { SaladIllustration } from "@/components/SaladIllustration";
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
}: {
  recipe: RecipeListItem;
  priority?: boolean;
  /** "feature" is the large lead card on the home page. */
  size?: "default" | "feature";
}) {
  const imageUrl = getImageUrl(recipe.image_path);
  const totalTime = recipe.prep_time_minutes + recipe.cook_time_minutes;
  const Placeholder =
    getPlaceholderVariant(recipe.id) === "salad" ? SaladIllustration : IngredientsIllustration;
  const rating =
    recipe.rating_count > 0 ? (recipe.rating_sum / recipe.rating_count).toFixed(1) : null;
  const meta = [
    recipe.category?.name,
    totalTime > 0 ? `${totalTime} мин` : null,
    `${recipe.servings} порции`,
    rating ? `★ ${rating}` : null,
  ].filter(Boolean);
  const isFeature = size === "feature";

  if (isFeature) {
    // The lead story, magazine-style: a 7/5 split with the photo bleeding to
    // the card's edge and the name at display size, so it reads in the first
    // viewport and leaves no empty white beside the image.
    return (
      <Link
        href={`/recepti/${recipe.slug}`}
        className="group grid overflow-hidden rounded-3xl bg-surface-muted md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]"
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
          <p className="mt-4 text-small text-muted-foreground tabular-nums">{meta.join(" · ")}</p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/recepti/${recipe.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-surface-muted"
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
        <p className="mt-1.5 text-small text-muted-foreground tabular-nums">{meta.join(" · ")}</p>
      </div>
    </Link>
  );
}
