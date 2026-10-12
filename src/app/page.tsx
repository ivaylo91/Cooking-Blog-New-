import Link from "next/link";
import { RecipeCard } from "@/components/RecipeCard";
import { ResumeCooking } from "@/components/ResumeCooking";
import { SectionHead } from "@/components/SectionHead";
import { SubscribeForm } from "@/components/SubscribeForm";
import { inCooksOrder } from "@/lib/categories";
import { getRecipes, getStockedCategories } from "@/lib/recipes";

export default async function Home() {
  const [recipes, categories, topRated] = await Promise.all([
    getRecipes({ limit: 7 }),
    getStockedCategories(),
    getRecipes({ limit: 3, sortBy: "rating" }),
  ]);
  // Rated, not liked: liking never caught on, so a likes section stayed empty.
  const trending = topRated.filter((r) => r.rating_count > 0);
  const [lead, ...latest] = recipes;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <section className="pt-8 sm:pt-12">
        <h1 className="max-w-3xl text-display font-bold leading-[1.05]">
          Домашни рецепти, изпробвани в моята кухня
        </h1>
        <p className="mt-3 max-w-2xl text-body text-muted-foreground">
          Кулинарният блог на Иво: проверени, подробни и лесни за следване рецепти
          за всеки, който обича да готви.
        </p>
        <ResumeCooking />
      </section>

      {lead && (
        <section aria-labelledby="lead-head" className="mt-10">
          <h2 id="lead-head" className="sr-only">
            Най-нова рецепта
          </h2>
          <RecipeCard recipe={lead} size="feature" priority />
        </section>
      )}

      {/* Categories, as a row that scrolls sideways on a phone. */}
      <nav aria-label="Категории" className="-mx-4 mt-14 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <ul className="flex gap-2">
          <li>
            <Link
              href="/recepti"
              className="flex h-11 items-center whitespace-nowrap rounded-full bg-foreground px-5 font-medium text-background"
            >
              Всички рецепти
            </Link>
          </li>
          {inCooksOrder(categories).map((category) => (
            <li key={category.id}>
              <Link
                href={`/recepti?category=${category.slug}`}
                className="flex h-11 items-center whitespace-nowrap rounded-full bg-surface-muted px-5 font-medium transition-colors hover:bg-border-subtle"
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {trending.length > 0 && (
        <section aria-labelledby="top-head" className="mt-16">
          <SectionHead title="Най-високо оценени" id="top-head" />
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {trending.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </section>
      )}

      <section aria-labelledby="latest-head" className="mt-16">
        <SectionHead
          title="Последни рецепти"
          id="latest-head"
          action={{ href: "/recepti", label: "Всички" }}
        />
        {recipes.length === 0 ? (
          <p className="text-muted-foreground">Все още няма публикувани рецепти.</p>
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {latest.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </section>

      <div className="mt-20">
        <SubscribeForm />
      </div>
    </div>
  );
}
