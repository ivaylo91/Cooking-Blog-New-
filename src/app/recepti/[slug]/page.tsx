import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
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
import { SubscribeForm } from "@/components/SubscribeForm";
import { Band } from "@/components/Band";
import { categoryTint } from "@/lib/categories";
import { getImageUrl, getPlaceholderVariant } from "@/lib/images";
import { getRecipeBySlug, getRecipeComments, getRecipes, getRelatedRecipes } from "@/lib/recipes";

// "Средно" reads as an adverb on its own; as a phrase it needs the feminine form.
const DIFFICULTY_LABEL: Record<string, string> = {
  лесно: "Лесна трудност",
  средно: "Средна трудност",
  трудно: "Висока трудност",
};

function isoDuration(minutes: number): string {
  return `PT${minutes}M`;
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
    author: { "@type": "Person", name: "Иво" },
    datePublished: recipe.created_at,
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

  // The facts a cook decides on first: portions and minutes.
  const facts = [
    { label: "Порции", value: recipe.servings, unit: "" },
    recipe.prep_time_minutes > 0
      ? { label: "Подготовка", value: recipe.prep_time_minutes, unit: "мин" }
      : null,
    recipe.cook_time_minutes > 0
      ? { label: "Готвене", value: recipe.cook_time_minutes, unit: "мин" }
      : null,
  ].filter((fact): fact is { label: string; value: number; unit: string } => fact !== null);

  const stepViews = recipe.steps.map((step) => ({
    id: step.id,
    text: step.text,
    imageUrl: getImageUrl(step.image_path),
  }));

  return (
    <article>
      <ReadingProgressBar targetId="recipe-body" />
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      {/* The dish first, on its category's colour: the photograph leads,
          edge to edge on a phone, and the header sits on the same band. */}
      <div style={{ backgroundColor: categoryTint(recipe.category?.slug) }}>
      <div className="mx-auto max-w-6xl sm:px-6 sm:pt-6 print:hidden">
        <div className="animate-rise relative h-[60svh] w-full overflow-hidden bg-surface-muted shadow-card sm:h-auto sm:aspect-[4/3] sm:rounded-3xl md:aspect-[21/9] lg:aspect-[16/5]">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={recipe.title}
              fill
              // Without this, `fill` assumes 100vw on desktop too and fetches
              // an oversized image for a container capped at 72rem.
              sizes="(min-width: 1152px) 1104px, 100vw"
              className="object-cover"
              priority
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
            <p className="mt-3 max-w-2xl text-body text-muted-foreground">{recipe.description}</p>
          </div>

          <div className="mt-6 lg:mt-0">
            <dl className="flex flex-wrap gap-x-10 gap-y-4 tabular-nums">
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="text-small text-muted-foreground">{fact.label}</dt>
                  <dd className="mt-0.5 text-heading font-bold">
                    {fact.value}
                    {fact.unit && (
                      <span className="ml-1 text-small font-medium text-muted-foreground">
                        {fact.unit}
                      </span>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-small text-muted-foreground">
              {DIFFICULTY_LABEL[recipe.difficulty] ?? recipe.difficulty}
            </p>
            {/* The blog's one claim, set apart in ink rather than buried in grey. */}
            <p className="mt-1 text-small font-semibold">
              {imageUrl ? "Сготвено и снимано в моята кухня." : "Сготвено в моята кухня."}
            </p>
          </div>
        </header>
      </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mt-4">
          <RecipeTabs />
        </div>

        {/* What goes in, then how. */}
        <div
          id="recipe-body"
          className="grid gap-14 py-8 md:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] md:gap-12 md:py-10 lg:grid-cols-[minmax(0,25rem)_minmax(0,1fr)] lg:gap-16 print:grid-cols-1"
        >
          <div className="rounded-3xl bg-sage p-5 sm:p-6 md:sticky md:top-24 md:max-h-[calc(100vh-7rem)] md:self-start md:overflow-y-auto print:static print:max-h-none print:bg-transparent print:p-0">
            <RecipeIngredients
              recipeId={recipe.id}
              slug={recipe.slug}
              title={recipe.title}
              ingredients={recipe.ingredients}
              baseServings={recipe.servings}
            />
          </div>

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
              <ul className="mt-6 flex flex-wrap gap-2 print:hidden" aria-label="Етикети">
                {recipe.tags.map((tag) => (
                  <li
                    key={tag.id}
                    className="rounded-full bg-olive px-3 py-1 text-small text-muted-foreground"
                  >
                    {tag.name}
                  </li>
                ))}
              </ul>
            )}

            {/* Asked after cooking, not before: rating, keeping and passing it on. */}
            <div className="mt-10 rounded-3xl bg-butter p-5 sm:p-6 print:hidden">
              <h2 className="text-heading font-bold">Как се получи?</h2>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
                <RatingStars
                  recipeId={recipe.id}
                  slug={recipe.slug}
                  average={ratingAverage}
                  count={recipe.rating_count}
                />
                <div className="flex items-center gap-2">
                  <LikeButton recipeId={recipe.id} initialLikes={recipe.likes_count} />
                  <PrintButton />
                  <ShareButtons title={recipe.title} url={recipeUrl} />
                </div>
              </div>
            </div>
          </section>
        </div>

        {relatedRecipes.length > 0 && (
          <section aria-labelledby="related-head" className="mt-12 print:hidden">
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

      <div className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 print:hidden">
        <Comments recipeId={recipe.id} comments={comments} />
      </div>
    </article>
  );
}
