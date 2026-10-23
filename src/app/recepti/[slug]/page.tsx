import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ChefHat, Clock, CookingPot, Timer, Users } from "lucide-react";
import { Comments } from "@/components/Comments";
import { CookMode } from "@/components/CookMode";
import { IngredientsIllustration } from "@/components/IngredientsIllustration";
import { JsonLd } from "@/components/JsonLd";
import { LikeButton } from "@/components/LikeButton";
import { PrintButton } from "@/components/PrintButton";
import { ReadingProgressBar } from "@/components/ReadingProgressBar";
import { RecipeCard } from "@/components/RecipeCard";
import { RatingStars } from "@/components/RatingStars";
import { RecipeIngredients } from "@/components/RecipeIngredients";
import { RecipeSteps } from "@/components/RecipeSteps";
import { RecipeTabs } from "@/components/RecipeTabs";
import { SectionHead } from "@/components/SectionHead";
import { SaladIllustration } from "@/components/SaladIllustration";
import { ShareButtons } from "@/components/ShareButtons";
import { StickyIfFits } from "@/components/StickyIfFits";
import { SubscribeForm } from "@/components/SubscribeForm";
import { Band } from "@/components/Band";
import { categoryTint } from "@/lib/categories";
import { getImageUrl, getPlaceholderVariant } from "@/lib/images";
import { keepShortWords } from "@/lib/typography";
import ivoPhoto from "@/app/za-ivo/ivo.jpg";
import { getRecipeBySlug, getRecipeComments, getRecipes, getRelatedRecipes } from "@/lib/recipes";

// "Средно" reads as an adverb on its own; under a "Трудност" label it needs
// the feminine adjective.
const DIFFICULTY_LABEL: Record<string, string> = {
  лесно: "Лесна",
  средно: "Средна",
  трудно: "Висока",
};

function isoDuration(minutes: number): string {
  return `PT${minutes}M`;
}

const dateFormat = new Intl.DateTimeFormat("bg-BG", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Europe/Sofia",
});

/** "16 октомври 2026", without the trailing " г." the locale adds. */
function formatDate(iso: string): string {
  return dateFormat.format(new Date(iso)).replace(/\s?г\.$/, "");
}

/** The calendar day in Sofia, so an edit later the same day isn't an "update". */
function sofiaDay(iso: string): string {
  return new Date(iso).toLocaleDateString("en-CA", { timeZone: "Europe/Sofia" });
}

// Prerender every published recipe at build time so visits are served from the
// CDN instead of round-tripping to Supabase. New slugs still render on demand.
export async function generateStaticParams() {
  const recipes = await getRecipes();
  return recipes.map((recipe) => ({ slug: recipe.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const recipe = await getRecipeBySlug(slug);
  if (!recipe) return {};
  return {
    title: recipe.title,
    description: recipe.description,
    alternates: { canonical: `/recepti/${recipe.slug}` },
    openGraph: {
      type: "article",
      title: recipe.title,
      description: recipe.description,
    },
    twitter: {
      card: "summary_large_image",
      title: recipe.title,
      description: recipe.description,
    },
  };
}

export default async function RecipePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const recipe = await getRecipeBySlug(slug);

  if (!recipe) {
    notFound();
  }

  const [comments, relatedRecipes] = await Promise.all([
    getRecipeComments(recipe.id),
    getRelatedRecipes(recipe.id, recipe.category_id),
  ]);
  const imageUrl = getImageUrl(recipe.image_path);
  const totalTime = recipe.prep_time_minutes + recipe.cook_time_minutes;
  const ratingAverage =
    recipe.rating_count > 0 ? recipe.rating_sum / recipe.rating_count : 0;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const recipeUrl = `${siteUrl}/recepti/${recipe.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: recipe.title,
    description: recipe.description,
    image: imageUrl ? [imageUrl] : undefined,
    author: { "@type": "Person", name: "Иво", url: `${siteUrl}/za-ivo` },
    datePublished: recipe.created_at,
    dateModified: recipe.updated_at,
    prepTime: isoDuration(recipe.prep_time_minutes),
    cookTime: isoDuration(recipe.cook_time_minutes),
    totalTime: isoDuration(totalTime),
    recipeYield: `${recipe.servings} порции`,
    recipeCategory: recipe.category?.name,
    recipeCuisine: recipe.cuisine,
    keywords: recipe.tags.map((t) => t.name).join(", "),
    recipeIngredient: recipe.ingredients.map((i) =>
      [i.amount, i.unit, i.item, i.note && `(${i.note})`].filter(Boolean).join(" ")
    ),
    recipeInstructions: recipe.steps.map((s) => ({
      "@type": "HowToStep",
      text: s.text,
      image: getImageUrl(s.image_path) ?? undefined,
    })),
    // Omitted entirely when nobody has rated yet: Google rejects an
    // aggregateRating with a zero count, and inventing one would be a
    // structured-data policy violation.
    aggregateRating:
      recipe.rating_count > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: Number(ratingAverage.toFixed(1)),
            ratingCount: recipe.rating_count,
            bestRating: 5,
            worstRating: 1,
          }
        : undefined,
    interactionStatistic: [
      {
        "@type": "InteractionCounter",
        interactionType: "https://schema.org/LikeAction",
        userInteractionCount: recipe.likes_count,
      },
      {
        "@type": "InteractionCounter",
        interactionType: "https://schema.org/CommentAction",
        userInteractionCount: comments.length,
      },
    ],
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Начало", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Рецепти", item: `${siteUrl}/recepti` },
      ...(recipe.category
        ? [
            {
              "@type": "ListItem",
              position: 3,
              name: recipe.category.name,
              item: `${siteUrl}/recepti?category=${recipe.category.slug}`,
            },
          ]
        : []),
      {
        "@type": "ListItem",
        position: recipe.category ? 4 : 3,
        name: recipe.title,
        item: recipeUrl,
      },
    ],
  };

  // The facts a cook decides on first: the whole time, then how it splits,
  // how many it feeds and how hard it is.
  type Fact = { label: string; value: string | number; unit?: string; icon: typeof Clock };
  const facts: Array<Fact | null> = [
    totalTime > 0 ? { label: "Общо", value: totalTime, unit: "мин", icon: Clock } : null,
    recipe.prep_time_minutes > 0 && recipe.cook_time_minutes > 0
      ? { label: "Подготовка", value: recipe.prep_time_minutes, unit: "мин", icon: Timer }
      : null,
    recipe.prep_time_minutes > 0 && recipe.cook_time_minutes > 0
      ? { label: "Готвене", value: recipe.cook_time_minutes, unit: "мин", icon: CookingPot }
      : null,
    { label: "Порции", value: recipe.servings, icon: Users },
    { label: "Трудност", value: DIFFICULTY_LABEL[recipe.difficulty] ?? recipe.difficulty, icon: ChefHat },
  ];

  const stepViews = recipe.steps.map((step) => ({
    id: step.id,
    text: keepShortWords(step.text),
    imageUrl: getImageUrl(step.image_path),
  }));

  return (
    <article>
      <ReadingProgressBar />
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      {/* The dish first, on its category's colour: the photograph leads,
          edge to edge on a phone, and the header sits on the same band. */}
      <div style={{ backgroundColor: categoryTint(recipe.category?.slug) }}>
      <div className="mx-auto max-w-6xl sm:px-6 sm:pt-6 print:hidden">
        <div className="animate-rise relative h-[40svh] w-full overflow-hidden bg-surface-muted shadow-card sm:h-auto sm:aspect-[4/3] sm:rounded-3xl md:aspect-[21/9] lg:aspect-[16/5]">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={recipe.title}
              fill
              // Without this, `fill` assumes 100vw on desktop too and fetches
              // an oversized image for a container capped at 72rem.
              sizes="(min-width: 1152px) 1104px, 100vw"
              className="object-cover"
              // The one LCP image on the page: Next 16's replacement for `priority`.
              preload
            />
          ) : getPlaceholderVariant(recipe.id) === "salad" ? (
            <SaladIllustration />
          ) : (
            <IngredientsIllustration />
          )}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-8 sm:px-6">
        <header className="grid gap-x-12 pt-5 sm:pt-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-end">
          <div>
            {recipe.category && (
              <Link
                href={`/recepti?category=${recipe.category.slug}`}
                className="inline-flex h-11 items-center gap-1.5 font-semibold text-link hover:underline print:hidden"
              >
                <ArrowLeft size={18} />
                {recipe.category.name}
              </Link>
            )}
            <h1 className="text-display font-bold">{recipe.title}</h1>
            <p className="mt-3 max-w-2xl text-body text-muted-foreground">
              {keepShortWords(recipe.description)}
            </p>

            {/* Who cooked it and when: the blog's one claim, with its owner. */}
            {/* One link for the whole byline, so it is a full-size target. */}
            <Link href="/za-ivo" className="group mt-5 flex w-fit items-center gap-3 rounded-2xl">
              <Image
                src={ivoPhoto}
                alt=""
                width={44}
                height={44}
                className="size-11 shrink-0 rounded-full object-cover ring-2 ring-surface print:hidden"
              />
              <span className="text-small leading-snug">
                <span className="block">
                  <span className="font-semibold text-foreground group-hover:underline">Иво</span>
                  <span className="text-muted-foreground">
                    {imageUrl ? ", сготвено и снимано в моята кухня" : ", сготвено в моята кухня"}
                  </span>
                </span>
                <span className="block text-muted-foreground">
                  Публикувано <time dateTime={recipe.created_at}>{formatDate(recipe.created_at)}</time>
                  {sofiaDay(recipe.updated_at) !== sofiaDay(recipe.created_at) && (
                    <>
                      , обновено{" "}
                      <time dateTime={recipe.updated_at}>{formatDate(recipe.updated_at)}</time>
                    </>
                  )}
                </span>
              </span>
            </Link>
            <p className="mt-3 hidden text-small print:block">
              Кулинарният блог на Иво, {recipeUrl}
            </p>
          </div>

          <div className="mt-6 lg:mt-0">
            {/* A grid, so a fourth or fifth fact starts a new aligned row
                rather than one value dangling on its own line. */}
            <dl className="grid grid-cols-3 gap-x-6 gap-y-4 tabular-nums sm:grid-cols-5 lg:grid-cols-3">
              {facts.filter((fact) => fact !== null).map((fact) => {
                const Icon = fact.icon;
                return (
                  <div key={fact.label}>
                    <dt className="flex items-center gap-1.5 text-small text-muted-foreground">
                      <Icon size={15} aria-hidden="true" />
                      {fact.label}
                    </dt>
                    <dd className="mt-0.5 text-heading font-bold">
                      {fact.value}
                      {fact.unit && (
                        <span className="ml-1 text-small font-medium text-muted-foreground">
                          {fact.unit}
                        </span>
                      )}
                    </dd>
                  </div>
                );
              })}
            </dl>
            {/* Keeping and passing it on belong where the cook decides to make it. */}
            <div className="mt-5 flex items-center gap-2 print:hidden">
              <PrintButton />
              <ShareButtons title={recipe.title} url={recipeUrl} />
            </div>
          </div>
        </header>
      </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="pt-4">
          <RecipeTabs />

        {/* What goes in, then how. */}
        <div
          id="recipe-body"
          data-reading-target
          className="grid gap-14 py-8 md:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] md:gap-12 md:py-10 lg:grid-cols-[minmax(0,25rem)_minmax(0,1fr)] lg:gap-16 print:grid-cols-1"
        >
          <StickyIfFits
            className="self-start rounded-3xl border border-border-subtle bg-surface p-5 shadow-card sm:p-6 print:static print:border-none print:bg-transparent print:p-0 print:shadow-none"
            stickyClassName="md:sticky md:top-24"
          >
            <RecipeIngredients
              recipeId={recipe.id}
              slug={recipe.slug}
              title={recipe.title}
              ingredients={recipe.ingredients}
              baseServings={recipe.servings}
            />
          </StickyIfFits>

          <section id="prigotvyane" aria-labelledby="prigotvyane-head">
            <h2 id="prigotvyane-head" className="sr-only text-heading font-bold md:not-sr-only">
              Приготвяне
            </h2>
            <div className="mt-5 print:hidden">
              <CookMode
                recipeId={recipe.id}
                slug={recipe.slug}
                title={recipe.title}
                steps={recipe.steps}
                ingredients={recipe.ingredients}
                servings={recipe.servings}
              />
            </div>
            <div className="mt-3">
              <RecipeSteps
                recipeId={recipe.id}
                slug={recipe.slug}
                title={recipe.title}
                steps={stepViews}
              />
            </div>

            {recipe.tags.length > 0 && (
              <p className="mt-6 text-small text-muted-foreground print:hidden">
                Етикети: {recipe.tags.map((tag) => tag.name).join(", ")}
              </p>
            )}

            {/* Asked after cooking, not before: rating, keeping and passing it on. */}
            <div className="mt-10 rounded-3xl border border-border-subtle bg-surface p-5 shadow-card sm:p-6 print:hidden">
              <h2 className="text-heading font-bold">Как се получи?</h2>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
                <RatingStars
                  recipeId={recipe.id}
                  slug={recipe.slug}
                  average={ratingAverage}
                  count={recipe.rating_count}
                />
                <LikeButton recipeId={recipe.id} initialLikes={recipe.likes_count} />
              </div>
            </div>
          </section>
        </div>
        </div>

        {/* The conversation belongs to the dish, so it follows the recipe
            directly; the newsletter comes last. */}
        <div className="print:hidden">
          <Comments recipeId={recipe.id} comments={comments} />
        </div>

        {relatedRecipes.length > 0 && (
          <section aria-labelledby="related-head" className="mt-20 print:hidden">
            <SectionHead
              title="Още рецепти"
              id="related-head"
              action={
                recipe.category
                  ? { href: `/recepti?category=${recipe.category.slug}`, label: recipe.category.name }
                  : { href: "/recepti", label: "Всички рецепти" }
              }
            />
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {relatedRecipes.map((related, index) => (
                <RecipeCard key={related.id} recipe={related} index={index} />
              ))}
            </div>
          </section>
        )}

      </div>

      <Band tone="butter" className="mt-20 print:hidden" innerClassName="py-14">
        <SubscribeForm />
      </Band>
    </article>
  );
}
