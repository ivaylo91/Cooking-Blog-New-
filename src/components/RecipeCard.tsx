import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, Star } from "lucide-react";
import { IngredientsIllustration } from "@/components/IngredientsIllustration";
import { SaladIllustration } from "@/components/SaladIllustration";
import { primaryPill } from "@/components/styles";
import { categoryTint } from "@/lib/categories";
import { keepShortWords } from "@/lib/typography";
import { getImageUrl, getPlaceholderVariant } from "@/lib/images";
import type { RecipeListItem } from "@/lib/recipes";

/**
 * A recipe the way a food app lists it: the photo leads at one fixed ratio,
 * the name follows, and a single quiet line carries category and minutes.
 */
export function RecipeCard({
  recipe,
  // Set on the cards above the fold. Those carry the page's LCP, and lazy
  // loading delays the request until layout, which pushes LCP out. Several
  // cards may be the LCP depending on width, so this loads them eagerly at
  // high priority rather than preloading one (Next 16 deprecated `priority`).
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
  // A coloured card body and a cream category label keep every shelf recognisable.
  const meta = (
    <>
      {recipe.category?.name && (
        <span
          className="rounded-full border border-border-subtle bg-surface px-2.5 py-1 font-medium text-foreground"
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
  const delay = animate ? { animationDelay: `${Math.min(index, 6) * 60}ms` } : {};
  const enter = animate ? "animate-rise" : "";
  const lift =
    "shadow-card transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lift active:translate-y-0 motion-reduce:hover:translate-y-0";

  if (isFeature) {
    // The lead dish pairs a large photograph with one clear recipe action.
    return (
      <Link
        href={`/recepti/${recipe.slug}`}
        style={delay}
        className={`${enter} group grid overflow-hidden rounded-3xl border border-border-subtle bg-surface md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] ${lift}`}
      >
        <div className="relative aspect-[4/3] w-full md:aspect-auto md:min-h-[22rem]">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt=""
              fill
              sizes="(min-width: 1152px) 644px, (min-width: 768px) 58vw, 100vw"
              className="object-cover"
              loading={priority ? "eager" : undefined}
              fetchPriority={priority ? "high" : undefined}
            />
          ) : (
            <Placeholder />
          )}
        </div>
        <div className="flex flex-col justify-center border-t-4 border-accent bg-butter p-6 sm:p-8 md:border-l-4 md:border-t-0 lg:p-10">
          <h2 className="text-feature font-bold group-hover:underline">{recipe.title}</h2>
          <p className="mt-4 text-body text-muted-foreground">{keepShortWords(recipe.description)}</p>
          <p className={`mt-4 ${metaRow}`}>{meta}</p>
          <span className={`mt-6 w-fit transition-colors group-hover:bg-accent-strong ${primaryPill}`}>
            Виж рецептата
            <ArrowRight size={18} aria-hidden="true" />
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/recepti/${recipe.slug}`}
      style={{ backgroundColor: categoryTint(recipe.category?.slug), ...delay }}
      className={`${enter} group flex flex-col overflow-hidden rounded-2xl border border-border-subtle ${lift}`}
    >
      <div className="relative aspect-[4/3] w-full">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt=""
            fill
            sizes="(min-width: 1152px) 352px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
            loading={priority ? "eager" : undefined}
            fetchPriority={priority ? "high" : undefined}
          />
        ) : (
          <Placeholder />
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-card font-bold group-hover:underline">{recipe.title}</h3>
        <p className={`mt-auto pt-4 ${metaRow}`}>{meta}</p>
      </div>
    </Link>
  );
}
