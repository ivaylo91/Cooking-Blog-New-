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
import { Stamp } from "@/components/Stamp";
import { SaladIllustration } from "@/components/SaladIllustration";
import { ShareButtons } from "@/components/ShareButtons";
import { SubscribeForm } from "@/components/SubscribeForm";
import { lidStyle } from "@/lib/categories";
import { getImageUrl, getPlaceholderVariant } from "@/lib/images";
import { getRecipeBySlug, getRecipeComments, getRecipes, getRelatedRecipes } from "@/lib/recipes";

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

  // Net weight, as the label prints it: the facts a cook decides on first.
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

      {/* Front of the pack: the category's lid colour, the dish's name, its
          net-weight facts and the quality stamp. */}
      <header
        style={lidStyle(recipe.category?.slug)}
        className="lid-field border-b-[3px] border-rule bg-[var(--lid)] text-[var(--lid-fg)] print:border-b-2 print:bg-transparent print:text-black"
      >
        <div className="mx-auto grid max-w-6xl gap-x-12 px-4 pt-4 sm:px-6 md:grid-cols-[1.15fr_1fr] md:py-10">
          <div className="pb-8 md:pb-0">
            {recipe.category && (
              <Link
                href={`/recepti?category=${recipe.category.slug}`}
                className="inline-flex h-11 items-center gap-1.5 font-heading text-lg font-bold uppercase tracking-[0.1em] underline-offset-4 hover:underline print:hidden"
              >
                <ArrowLeft size={18} strokeWidth={2.75} />
                {recipe.category.name}
              </Link>
            )}
            <h1 className="mt-3 font-heading text-[clamp(3rem,13vw,6rem)] font-black uppercase leading-[0.86] tracking-[-0.005em] [text-wrap:balance]">
              {recipe.title}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-snug sm:text-xl">{recipe.description}</p>

            <div className="mt-7 flex items-center">
              <dl className="grid flex-1 grid-flow-col border-y-2 border-current font-heading uppercase tabular-nums">
                {facts.map((fact) => (
                  <div
                    key={fact.label}
                    className="border-r border-current/40 py-3 pl-3 pr-3 first:pl-0 last:border-r-0"
                  >
                    <dt className="text-xs font-bold tracking-[0.12em] sm:text-sm">{fact.label}</dt>
                    <dd className="mt-1 text-[2.6rem] font-black leading-none sm:text-5xl">
                      {fact.value}
                      {fact.unit && (
                        <span className="ml-1 text-base font-extrabold tracking-wide sm:text-lg">
                          {fact.unit}
                        </span>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
              <Stamp size={92} className="-ml-3 sm:size-[108px] print:hidden" />
            </div>
            <p className="mt-3 font-heading text-lg font-bold uppercase tracking-[0.1em]">
              Трудност: {recipe.difficulty}
            </p>
          </div>

          {/* The product window: the photo, cut into the label. */}
          <div className="relative -mx-4 aspect-[4/3] overflow-hidden border-t-[3px] border-current sm:-mx-6 md:mx-0 md:aspect-[5/4] md:self-center md:border-[3px] print:hidden">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={recipe.title}
                fill
                // Without this, `fill` assumes 100vw and fetches a 1920px-wide
                // image for what is a column on desktop.
                sizes="(min-width: 768px) 45vw, 100vw"
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
      </header>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <RecipeTabs />

        {/* Back of the pack: what goes in, then how. */}
        <div
          id="recipe-body"
          className="grid gap-14 py-10 md:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] md:gap-12 lg:grid-cols-[minmax(0,25rem)_minmax(0,1fr)] lg:gap-16 print:grid-cols-1"
        >
          <div className="md:sticky md:top-24 md:max-h-[calc(100vh-7rem)] md:self-start md:overflow-y-auto md:pr-1 print:static print:max-h-none">
            <RecipeIngredients
              recipeId={recipe.id}
              ingredients={recipe.ingredients}
              baseServings={recipe.servings}
            />
          </div>

          <section id="prigotvyane" aria-labelledby="prigotvyane-head">
            <h2
              id="prigotvyane-head"
              className="border-b-[3px] border-rule pb-2 font-heading text-[2.75rem] font-extrabold uppercase leading-[0.9] tracking-wide"
            >
              Начин на приготвяне
            </h2>
            <div className="mt-5 print:hidden">
              <CookMode
                recipeId={recipe.id}
                title={recipe.title}
                steps={recipe.steps}
                ingredients={recipe.ingredients}
                servings={recipe.servings}
                categorySlug={recipe.category?.slug}
              />
            </div>
            <div className="mt-3">
              <RecipeSteps recipeId={recipe.id} steps={stepViews} />
            </div>

            {recipe.tags.length > 0 && (
              <p className="mt-8 border-t border-border-subtle pt-4 text-base text-muted-foreground print:hidden">
                <span className="font-heading font-bold uppercase tracking-[0.1em]">Етикети: </span>
                {recipe.tags.map((tag) => tag.name).join(", ")}
              </p>
            )}

            {/* Asked after cooking, not before: rating, keeping and passing it on. */}
            <div className="mt-10 border-2 border-rule print:hidden">
              <h2 className="border-b-2 border-rule px-4 py-3 font-heading text-2xl font-extrabold uppercase tracking-wide">
                Как се получи?
              </h2>
              <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 py-3">
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
          <section aria-labelledby="related-head" className="mt-6 print:hidden">
            <SectionHead
              title="Още от рафта"
              id="related-head"
              action={
                recipe.category
                  ? { href: `/recepti?category=${recipe.category.slug}`, label: recipe.category.name }
                  : { href: "/recepti", label: "Всички рецепти" }
              }
            />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedRecipes.map((related) => (
                <RecipeCard key={related.id} recipe={related} />
              ))}
            </div>
          </section>
        )}

        <div className="mt-16 print:hidden">
          <SubscribeForm />
        </div>

        <div className="mb-16 print:hidden">
          <Comments recipeId={recipe.id} comments={comments} />
        </div>
      </div>
    </article>
  );
}
