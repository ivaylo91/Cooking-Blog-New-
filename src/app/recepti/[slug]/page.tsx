import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { RecipeIngredients } from "@/components/RecipeIngredients";
import { getImageUrl } from "@/lib/images";
import { getRecipeBySlug } from "@/lib/recipes";

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

  const imageUrl = getImageUrl(recipe.image_path);
  const totalTime = recipe.prep_time_minutes + recipe.cook_time_minutes;

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
  };

  return (
    <article className="mx-auto max-w-3xl px-6 py-12 print:max-w-none">
      <JsonLd data={jsonLd} />

      {recipe.category && (
        <p className="text-sm font-medium uppercase tracking-wide text-amber-700 dark:text-amber-500">
          {recipe.category.name}
        </p>
      )}
      <h1 className="mt-1 text-3xl font-semibold tracking-tight">{recipe.title}</h1>
      <p className="mt-3 text-zinc-600 dark:text-zinc-400">{recipe.description}</p>

      <div className="mt-4 flex flex-wrap gap-4 text-sm text-zinc-500">
        {recipe.prep_time_minutes > 0 && <span>Подготовка: {recipe.prep_time_minutes} мин</span>}
        {recipe.cook_time_minutes > 0 && <span>Готвене: {recipe.cook_time_minutes} мин</span>}
        <span>Трудност: {recipe.difficulty}</span>
      </div>

      {imageUrl && (
        <div className="relative mt-6 aspect-video w-full overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-900 print:hidden">
          <Image src={imageUrl} alt={recipe.title} fill className="object-cover" priority />
        </div>
      )}

      <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-[1fr_2fr]">
        <section>
          <h2 className="mb-4 text-lg font-semibold">Продукти</h2>
          <RecipeIngredients ingredients={recipe.ingredients} baseServings={recipe.servings} />
        </section>

        <section>
          <h2 className="mb-4 text-lg font-semibold">Приготвяне</h2>
          <ol className="space-y-4">
            {recipe.steps.map((step, index) => (
              <li key={step.id} className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black text-xs font-medium text-white dark:bg-white dark:text-black">
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
              className="rounded-full border border-black/10 px-3 py-1 text-xs text-zinc-600 dark:border-white/15 dark:text-zinc-400"
            >
              {tag.name}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
