import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Band } from "@/components/Band";
import { RecipeCard } from "@/components/RecipeCard";
import { ResumeCooking } from "@/components/ResumeCooking";
import { SectionHead } from "@/components/SectionHead";
import { SubscribeForm } from "@/components/SubscribeForm";
import { categoryTint, inCooksOrder } from "@/lib/categories";
import { getRecipes, getStockedCategories } from "@/lib/recipes";

export default async function Home() {
  const [recipes, allRecipes, categories, topRated] = await Promise.all([
    getRecipes({ limit: 7 }),
    getRecipes(),
    getStockedCategories(),
    getRecipes({ limit: 3, sortBy: "rating" }),
  ]);
  // Rated, not liked: liking never caught on, so a likes section stayed empty.
  const trending = topRated.filter((r) => r.rating_count > 0);
  const [lead, ...latest] = recipes;

  const counts = new Map<string, number>();
  for (const recipe of allRecipes) {
    if (recipe.category_id) counts.set(recipe.category_id, (counts.get(recipe.category_id) ?? 0) + 1);
  }

  return (
    <div>
      {/* Peach opening spread: the promise, then the newest dish. */}
      <Band tone="peach" innerClassName="pb-12 pt-10 sm:pb-16 sm:pt-14">
        <h1 className="animate-rise max-w-3xl text-display font-bold">
          Домашни рецепти, изпробвани в моята кухня
        </h1>
        <p
          className="animate-rise mt-3 max-w-2xl text-body text-muted-foreground"
          style={{ animationDelay: "80ms" }}
        >
          Кулинарният блог на Иво: проверени, подробни и лесни за следване рецепти
          за всеки, който обича да готви.
        </p>
        <ResumeCooking />

        {lead && (
          <section aria-labelledby="lead-head" className="mt-10">
            <h2 id="lead-head" className="sr-only">
              Най-нова рецепта
            </h2>
            <RecipeCard recipe={lead} size="feature" priority />
          </section>
        )}
      </Band>

      {/* Sage band: the shelves, each in its own food colour. */}
      <Band tone="sage" innerClassName="py-12 sm:py-14" aria-labelledby="shelf-head">
        <SectionHead
          title="Категории"
          id="shelf-head"
          action={{ href: "/recepti", label: "Всички рецепти" }}
        />
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {inCooksOrder(categories).map((category, index) => (
            <li key={category.id}>
              <Link
                href={`/recepti?category=${category.slug}`}
                style={{
                  backgroundColor: categoryTint(category.slug),
                  animationDelay: `${index * 50}ms`,
                }}
                className="animate-rise group flex h-28 flex-col justify-between rounded-2xl p-4 shadow-card transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-lift"
              >
                <ArrowRight
                  size={20}
                  className="self-end text-muted-foreground transition-transform duration-300 group-hover:translate-x-1"
                />
                <span>
                  <span className="block text-heading font-bold leading-tight">{category.name}</span>
                  <span className="text-small text-muted-foreground tabular-nums">
                    {counts.get(category.id) ?? 0} рецепти
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Band>

      {trending.length > 0 && (
        <Band tone="plain" innerClassName="pt-14" aria-labelledby="top-head">
          <SectionHead title="Най-високо оценени" id="top-head" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {trending.map((recipe, index) => (
              <RecipeCard key={recipe.id} recipe={recipe} index={index} />
            ))}
          </div>
        </Band>
      )}

      <Band tone="plain" innerClassName="py-14" aria-labelledby="latest-head">
        <SectionHead
          title="Последни рецепти"
          id="latest-head"
          action={{ href: "/recepti", label: "Всички" }}
        />
        {recipes.length === 0 ? (
          <p className="text-muted-foreground">Все още няма публикувани рецепти.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latest.map((recipe, index) => (
              <RecipeCard key={recipe.id} recipe={recipe} index={index} />
            ))}
          </div>
        )}
      </Band>

      <Band tone="butter" innerClassName="py-14">
        <SubscribeForm />
      </Band>
    </div>
  );
}
