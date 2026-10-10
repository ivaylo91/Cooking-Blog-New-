import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CookingBackground } from "@/components/CookingBackground";
import { RecipeCard } from "@/components/RecipeCard";
import { SectionHead } from "@/components/SectionHead";
import { Stamp } from "@/components/Stamp";
import { SubscribeForm } from "@/components/SubscribeForm";
import { inCooksOrder, lidStyle } from "@/lib/categories";
import { getCategories, getRecipes } from "@/lib/recipes";

function recipeCount(n: number) {
  return n === 1 ? "1 рецепта" : `${n} рецепти`;
}

export default async function Home() {
  const [recipes, allRecipes, categories, topRated] = await Promise.all([
    getRecipes({ limit: 6 }),
    getRecipes(),
    getCategories(),
    getRecipes({ limit: 3, sortBy: "rating" }),
  ]);
  // Rated, not liked: liking never caught on, so a likes section stayed empty.
  const trending = topRated.filter((r) => r.rating_count > 0);

  const countByCategory = new Map<string, number>();
  for (const recipe of allRecipes) {
    if (recipe.category_id) {
      countByCategory.set(recipe.category_id, (countByCategory.get(recipe.category_id) ?? 0) + 1);
    }
  }
  // An empty shelf is a dead end: only show categories that hold recipes.
  const shelf = inCooksOrder(categories).filter((c) => (countByCategory.get(c.id) ?? 0) > 0);

  return (
    <div>
      {/* The blog's own pack: a cobalt tub, its name in the clear middle and
          the doodle print confined to bands above and below it. */}
      <section className="lid-field border-b-[3px] border-rule bg-brand text-white">
        <div className="relative h-14 border-b-2 border-white/35">
          <CookingBackground className="absolute inset-0 text-white" opacity={0.4} scale={0.36} />
        </div>

        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <h1 className="font-heading text-[clamp(3.4rem,14.5vw,6rem)] font-black uppercase leading-[0.86] tracking-[-0.005em] [text-wrap:balance]">
              Кулинарният блог на Иво
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-snug text-white sm:text-xl">
              Домашни рецепти за хобиисти и ентусиасти на готвенето — проверени,
              подробни и лесни за следване.
            </p>
            <div className="mt-8 flex items-center">
              <Link
                href="/recepti"
                className="inline-flex h-14 items-center gap-2 border-2 border-white bg-white px-6 font-heading text-xl font-extrabold uppercase tracking-wide text-[#14161a] transition-colors hover:bg-transparent hover:text-white"
              >
                Разгледай рецептите
                <ArrowRight size={22} strokeWidth={2.5} />
              </Link>
              {/* On a phone the stamp is pressed onto the CTA's edge, as on a recipe's facts row. */}
              <Stamp size={96} className="-ml-4 lg:hidden" />
            </div>
          </div>

          {/* The quality mark, on its own beside the name: no stats box. */}
          <Stamp size={132} className="hidden self-center lg:block" />
        </div>

        <div className="relative h-14 border-t-2 border-white/35">
          <CookingBackground className="absolute inset-0 text-white" opacity={0.4} scale={0.36} />
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        {/* The shelf: one lid per product line, colour-coded like the tubs. */}
        <section aria-labelledby="shelf-head">
          <SectionHead title="Категории" id="shelf-head" />
          <ul
            // As many columns as stocked shelves, so hiding an empty one leaves no gap.
            style={{ "--shelves": shelf.length } as React.CSSProperties}
            className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:[grid-template-columns:repeat(var(--shelves),minmax(0,1fr))]"
          >
            {shelf.map((category) => (
              <li key={category.id}>
                <Link
                  href={`/recepti?category=${category.slug}`}
                  style={lidStyle(category.slug)}
                  className="lid-field group flex h-28 flex-col justify-end gap-1 border-2 border-rule bg-[var(--lid)] p-3 text-[var(--lid-fg)]"
                >
                  <span className="font-heading text-[1.6rem] font-extrabold uppercase leading-[0.95] tracking-wide group-hover:underline">
                    {category.name}
                  </span>
                  <span className="font-heading text-lg font-bold tabular-nums">
                    {recipeCount(countByCategory.get(category.id) ?? 0)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {trending.length > 0 && (
          <section aria-labelledby="top-head" className="mt-16">
            <SectionHead title="Най-високо оценени" id="top-head" />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {trending.map((recipe, index) => (
                <RecipeCard key={recipe.id} recipe={recipe} priority={index < 3} />
              ))}
            </div>
          </section>
        )}

        <section aria-labelledby="latest-head" className="mt-16">
          <SectionHead
            title="Последни рецепти"
            id="latest-head"
            action={{ href: "/recepti", label: "Всички рецепти" }}
          />
          {recipes.length === 0 ? (
            <p className="text-muted-foreground">Все още няма публикувани рецепти.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {recipes.map((recipe, index) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  priority={trending.length === 0 && index < 3}
                />
              ))}
            </div>
          )}
        </section>

        <div className="mt-16">
          <SubscribeForm />
        </div>
      </div>
    </div>
  );
}
