import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ChefHat, Clock, Users } from "lucide-react";
import { Comments } from "@/components/Comments";
import { JsonLd } from "@/components/JsonLd";
import { LikeButton } from "@/components/LikeButton";
import { PrintButton } from "@/components/PrintButton";
import { RecipeIngredients } from "@/components/RecipeIngredients";
import { ShareButtons } from "@/components/ShareButtons";
import { getImageUrl } from "@/lib/images";
import { getRecipeBySlug, getRecipeComments } from "@/lib/recipes";

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

  const comments = await getRecipeComments(recipe.id);
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

  return (
    <article className="print:mx-6">
      <JsonLd data={jsonLd} />

      <div className="relative h-[42vh] min-h-[280px] w-full overflow-hidden bg-surface-muted print:hidden">
        {imageUrl ? (
          <Image src={imageUrl} alt={recipe.title} fill className="object-cover" priority />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <ChefHat size={48} strokeWidth={1.5} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-4xl px-6 pb-8">
          {recipe.category && (
            <span className="mb-2 inline-block rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-foreground">
              {recipe.category.name}
            </span>
          )}
          <h1 className="font-heading text-3xl font-bold text-white drop-shadow-sm sm:text-4xl">
            {recipe.title}
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="hidden print:block">
          {recipe.category && (
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-accent-strong">
              {recipe.category.name}
            </span>
          )}
          <h1 className="font-heading text-3xl font-bold">{recipe.title}</h1>
        </div>

        <p className="mt-2 text-lg text-muted-foreground">{recipe.description}</p>

        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 border-y border-border-subtle py-4 text-sm">
          {recipe.prep_time_minutes > 0 && (
            <span className="flex items-center gap-1.5">
              <Clock size={15} className="text-accent" /> Подготовка: {recipe.prep_time_minutes} мин
            </span>
          )}
          {recipe.cook_time_minutes > 0 && (
            <span className="flex items-center gap-1.5">
              <Clock size={15} className="text-accent" /> Готвене: {recipe.cook_time_minutes} мин
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Users size={15} className="text-accent" /> {recipe.servings} порции
          </span>
          <span className="capitalize">Трудност: {recipe.difficulty}</span>
          <PrintButton />
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 print:hidden">
          <LikeButton recipeId={recipe.id} initialLikes={recipe.likes_count} />
          <ShareButtons title={recipe.title} url={recipeUrl} />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,300px)_1fr]">
          <aside className="md:sticky md:top-24 md:self-start">
            <RecipeIngredients ingredients={recipe.ingredients} baseServings={recipe.servings} />
          </aside>

          <section>
            <h2 className="mb-5 font-heading text-xl font-semibold">Приготвяне</h2>
            <ol className="relative space-y-6 border-l border-border-subtle pl-8">
              {recipe.steps.map((step, index) => (
                <li key={step.id} className="relative">
                  <span className="absolute -left-[calc(2rem+1px)] flex h-7 w-7 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-relaxed">{step.text}</p>
                </li>
              ))}
            </ol>
          </section>
        </div>

        {recipe.tags.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2 print:hidden">
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

        <div className="print:hidden">
          <Comments recipeId={recipe.id} slug={recipe.slug} comments={comments} />
        </div>
      </div>
    </article>
  );
}
