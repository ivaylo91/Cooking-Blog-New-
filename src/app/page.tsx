import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CookingBackground } from "@/components/CookingBackground";
import { RecipeCard } from "@/components/RecipeCard";
import { getCategories, getRecipes } from "@/lib/recipes";

export default async function Home() {
  const [recipes, categories] = await Promise.all([
    getRecipes({ limit: 6 }),
    getCategories(),
  ]);

  return (
    <div>
      <section className="relative overflow-hidden bg-surface-muted">
        <CookingBackground variant="absolute" />
        <div className="relative mx-auto flex max-w-5xl flex-col items-center px-6 py-20 text-center sm:py-28">
          <span className="mb-4 rounded-full bg-accent-soft px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-accent-strong">
            Домашна кухня
          </span>
          <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl">
            Кулинарният блог на Иво
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            Домашни рецепти за хобиисти и ентусиасти на готвенето — проверени,
            подробни и лесни за следване.
          </p>
          <Link
            href="/recepti"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition hover:bg-accent-strong"
          >
            Разгледай рецептите
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-6 py-14">
        <section className="mb-14 flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/recepti?category=${category.slug}`}
              className="rounded-full border border-border-subtle px-4 py-1.5 text-sm font-medium transition hover:border-accent hover:text-accent"
            >
              {category.name}
            </Link>
          ))}
        </section>

        <section>
          <div className="mb-6 flex items-end justify-between">
            <h2 className="font-heading text-2xl font-semibold">Последни рецепти</h2>
            <Link
              href="/recepti"
              className="flex items-center gap-1 text-sm font-medium text-accent hover:underline"
            >
              Всички рецепти <ArrowRight size={14} />
            </Link>
          </div>
          {recipes.length === 0 ? (
            <p className="text-muted-foreground">Все още няма публикувани рецепти.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
              {recipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
