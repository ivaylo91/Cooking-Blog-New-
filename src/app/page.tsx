import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Band } from "@/components/Band";
import { RecipeCard } from "@/components/RecipeCard";
import { ResumeCooking } from "@/components/ResumeCooking";
import { SectionHead } from "@/components/SectionHead";
import { SubscribeForm } from "@/components/SubscribeForm";
import { categoryTint, inCooksOrder } from "@/lib/categories";
import { getImageUrl } from "@/lib/images";
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

  // Per shelf: how many recipes, and the newest photo to show on its tile.
  // The list arrives newest first, so the first image seen is the latest.
  const counts = new Map<string, number>();
  const covers = new Map<string, string>();
  for (const recipe of allRecipes) {
    if (!recipe.category_id) continue;
    counts.set(recipe.category_id, (counts.get(recipe.category_id) ?? 0) + 1);
    const url = getImageUrl(recipe.image_path);
    if (url && !covers.has(recipe.category_id)) covers.set(recipe.category_id, url);
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
                className="animate-rise group flex h-full min-h-36 flex-col justify-between gap-3 rounded-2xl p-4 shadow-card transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-lift"
              >
                <span className="flex items-start justify-between">
                  {/* A taste of the shelf: its newest dish, when it has a photo. */}
                  {covers.has(category.id) ? (
                    <span className="relative size-14 overflow-hidden rounded-full shadow-card ring-2 ring-surface">
                      <Image
                        src={covers.get(category.id)!}
                        alt=""
                        fill
                        sizes="56px"
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </span>
                  ) : (
                    <span />
                  )}
                  <ArrowRight
                    size={20}
                    className="text-muted-foreground transition-transform duration-300 group-hover:translate-x-1"
                  />
                </span>
                <span>
                  <span className="block font-heading text-heading font-bold leading-tight">{category.name}</span>
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
          {/* A swipeable shelf, so it doesn't read as a second copy of the grid below. */}
          <ul className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-4 sm:-mx-6 sm:scroll-px-6 sm:px-6 [scrollbar-width:thin]">
            {trending.map((recipe, index) => (
              <li key={recipe.id} className="flex w-[78%] shrink-0 snap-start sm:w-[45%] lg:w-[31%]">
                <RecipeCard recipe={recipe} index={index} />
              </li>
            ))}
          </ul>
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
