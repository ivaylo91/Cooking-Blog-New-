import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Comments } from "@/components/Comments";
import { CookMode } from "@/components/CookMode";
import { IngredientsIllustration } from "@/components/IngredientsIllustration";
import { JsonLd } from "@/components/JsonLd";
import { LikeButton } from "@/components/LikeButton";
import { PrintButton } from "@/components/PrintButton";
import { RecipeCard } from "@/components/RecipeCard";
import { RecipeIngredients } from "@/components/RecipeIngredients";
import { ShareButtons } from "@/components/ShareButtons";
import { getImageUrl } from "@/lib/images";
import { getRecipeBySlug, getRecipeComments, getRelatedRecipes } from "@/lib/recipes";

function isoDuration(minutes: number): string {
  return `PT${minutes}M`;
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
  };
}

export default async function RecipePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const recipe = await getRecipeBySlug(slug);

  if (!recipe || !recipe.published) {
    notFound();
  }

  const [comments, relatedRecipes] = await Promise.all([
    getRecipeComments(recipe.id),
    getRelatedRecipes(recipe.id, recipe.category_id),
  ]);
  const imageUrl = getImageUrl(recipe.image_path);
  const totalTime = recipe.prep_time_minutes + recipe.cook_time_minutes;
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

  const metaParts = [
    `${recipe.servings} порции`,
    recipe.prep_time_minutes > 0 ? `подготовка: ${recipe.prep_time_minutes} мин` : null,
    recipe.cook_time_minutes > 0 ? `готвене: ${recipe.cook_time_minutes} мин` : null,
    recipe.difficulty,
  ].filter(Boolean);

  return (
    <article className="print:mx-6">
      <JsonLd data={jsonLd} />

      <div className="mx-auto max-w-6xl px-6 py-10 md:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-14 print:grid-cols-1 lg:gap-20">
          <div className="relative order-first aspect-[4/5] w-full overflow-hidden rounded-2xl bg-surface-muted md:sticky md:top-24 md:order-last md:self-start print:hidden">
            {imageUrl ? (
              <Image src={imageUrl} alt={recipe.title} fill className="object-cover" priority />
            ) : (
              <IngredientsIllustration />
            )}
          </div>

          <div>
            {recipe.category && (
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                {recipe.category.name}
              </p>
            )}
            <h1 className="font-heading text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
              {recipe.title}
            </h1>

            <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-border-subtle pt-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {metaParts.map((part, index) => (
                <span key={part} className="flex items-center gap-2">
                  {index > 0 && <span className="text-border-subtle">/</span>}
                  {part}
                </span>
              ))}
            </p>

            <p className="mt-4 text-base text-muted-foreground">{recipe.description}</p>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-4 print:hidden">
              <LikeButton recipeId={recipe.id} initialLikes={recipe.likes_count} />
              <div className="flex items-center gap-2">
                <PrintButton />
                <ShareButtons title={recipe.title} url={recipeUrl} />
              </div>
            </div>

            <div className="mt-8">
              <RecipeIngredients ingredients={recipe.ingredients} baseServings={recipe.servings} />
            </div>

            <div className="mt-8">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-border-subtle pb-3">
                <h2 className="font-heading text-xl font-semibold">Приготвяне</h2>
                <div className="print:hidden">
                  <CookMode title={recipe.title} steps={recipe.steps} />
                </div>
              </div>
              <ol className="relative space-y-6 border-l border-border-subtle pl-8">
                {recipe.steps.map((step, index) => {
                  const stepImageUrl = getImageUrl(step.image_path);
                  return (
                    <li key={step.id} className="relative">
                      <span className="absolute -left-[calc(2rem+1px)] flex h-7 w-7 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
                        {index + 1}
                      </span>
                      <p className="text-sm leading-relaxed">{step.text}</p>
                      {stepImageUrl && (
                        <div className="relative mt-3 aspect-video w-full max-w-sm overflow-hidden rounded-xl bg-surface-muted print:hidden">
                          <Image src={stepImageUrl} alt="" fill className="object-cover" />
                        </div>
                      )}
                    </li>
                  );
                })}
              </ol>
            </div>

            {recipe.tags.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2 print:hidden">
                {recipe.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="rounded-full bg-secondary-soft px-3 py-1 text-xs font-medium text-secondary"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {relatedRecipes.length > 0 && (
          <div className="mt-16 border-t border-border-subtle pt-8 print:hidden">
            <h2 className="mb-5 font-heading text-xl font-semibold">Още рецепти</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {relatedRecipes.map((related) => (
                <RecipeCard key={related.id} recipe={related} />
              ))}
            </div>
          </div>
        )}

        <div className="print:hidden">
          <Comments recipeId={recipe.id} slug={recipe.slug} comments={comments} />
        </div>
      </div>
    </article>
  );
}
