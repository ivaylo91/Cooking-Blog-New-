import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AuthorPortrait } from "@/components/AuthorPortrait";
import { Band } from "@/components/Band";
import { CategoryIcon } from "@/components/CategoryIcon";
import { RecipeCard } from "@/components/RecipeCard";
import { ResumeCooking } from "@/components/ResumeCooking";
import { SectionHead } from "@/components/SectionHead";
import { SubscribeForm } from "@/components/SubscribeForm";
import { categoryTint, inCooksOrder } from "@/lib/categories";
import { getRecipes, getStockedCategories } from "@/lib/recipes";
import { keepShortWords } from "@/lib/typography";

export const metadata: Metadata = {
  title: { absolute: "Кулинарният блог на Иво: домашни рецепти, изпробвани в моята кухня" },
  alternates: { canonical: "/" },
};

export default async function Home() {
  const [recipes, categories, topRated] = await Promise.all([
    getRecipes({ limit: 7 }),
    getStockedCategories(),
    getRecipes({ limit: 3, sortBy: "rating" }),
  ]);
  // Only recipes someone has rated: an unrated shelf would be an empty promise.
  const trending = topRated.filter((r) => r.rating_count > 0);
  const [lead, ...latest] = recipes;
  const showLatest = latest.length > 0 || recipes.length === 0;

  return (
    <div>
      <Band tone="peach" pattern innerClassName="py-12 sm:py-16">
        <div className="grid gap-4 rounded-3xl bg-peach p-5 sm:p-8 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:gap-16">
          <h1 className="animate-rise max-w-xl text-display font-bold">
            {keepShortWords("Добре дошли в моята кухня")}
          </h1>
          <p className="animate-rise max-w-xl text-body text-muted-foreground">
            {keepShortWords("Аз съм Иво. Тук споделям домашни рецепти, които съм сготвил лично, с точни мерки и ясни стъпки. Нека приготвим нещо вкусно заедно!")}
          </p>
        </div>
        {lead && (
          <section aria-label="Най-нова рецепта" className="mt-7 sm:mt-8">
            <RecipeCard recipe={lead} size="feature" priority />
          </section>
        )}
        {/* Only the cooking browser renders it, after load; below the lead dish
            it can't push the page's largest picture down. */}
        <ResumeCooking />
      </Band>

      {categories.length > 0 && (
        // The latest band below is also cream, so its top padding doubles as
        // this band's bottom; without it, the shelf needs its own.
        <Band
          tone="plain"
          innerClassName={`pt-12 sm:pt-16 ${showLatest ? "" : "pb-12 sm:pb-16"}`}
          aria-labelledby="shelf-head"
        >
          <SectionHead
            title="Какво ви се хапва?"
            id="shelf-head"
            action={{ href: "/recepti", label: "Всички рецепти" }}
          />
          <ul className="flex flex-wrap gap-3">
            {inCooksOrder(categories).map((category) => (
              <li key={category.id} className="min-w-0 flex-[1_1_9rem] lg:flex-[1_1_0]">
                <Link
                  href={`/recepti?category=${category.slug}`}
                  style={{ backgroundColor: categoryTint(category.slug) }}
                  className="group flex h-full min-h-20 items-center gap-3 rounded-2xl border border-border-subtle p-3 text-small font-semibold shadow-card transition-[transform,box-shadow] hover:shadow-lift motion-safe:hover:-translate-y-0.5 sm:min-h-32 sm:flex-col sm:justify-center sm:p-4 sm:text-center"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-surface text-link">
                    <CategoryIcon slug={category.slug} size={22} />
                  </span>
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </Band>
      )}

      {showLatest && (
        <Band tone="plain" innerClassName="py-12 sm:py-16" aria-labelledby="latest-head">
          <SectionHead
            title="Последни рецепти"
            id="latest-head"
            action={{ href: "/recepti", label: "Всички рецепти" }}
          />
          {recipes.length === 0 ? (
            <p className="text-muted-foreground">Все още няма публикувани рецепти.</p>
          ) : (
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {latest.map((recipe, index) => (
                <RecipeCard key={recipe.id} recipe={recipe} index={index} />
              ))}
            </div>
          )}
        </Band>
      )}

      {trending.length > 0 && (
        <Band tone="sage" className="border-y border-border-subtle" innerClassName="py-12 sm:py-16" aria-labelledby="top-head">
          <SectionHead title="Най-високо оценени" id="top-head" />
          <ul className="-mx-4 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-px-4 px-4 pb-4 sm:-mx-6 sm:scroll-px-6 sm:px-6 [scrollbar-width:thin]">
            {trending.map((recipe, index) => (
              <li key={recipe.id} className="grid w-[78%] shrink-0 snap-start sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)]">
                <RecipeCard recipe={recipe} index={index} />
              </li>
            ))}
          </ul>
        </Band>
      )}

      <Band tone="garden" innerClassName="py-12 sm:py-16" aria-labelledby="about-head">
        <div className="grid gap-6 sm:grid-cols-[10rem_minmax(0,1fr)] sm:items-center sm:gap-10 lg:grid-cols-[12rem_minmax(0,1fr)] lg:gap-14">
          <AuthorPortrait
            className="w-36 ring-4 ring-on-garden sm:w-full"
            sizes="(min-width: 1024px) 192px, (min-width: 640px) 160px, 144px"
          />
          <div>
            <h2 id="about-head" className="text-section font-bold">Здравейте, аз съм Иво</h2>
            <p className="mt-4 max-w-2xl text-on-garden-muted">
              {keepShortWords("Готвя у дома и тук събирам рецептите си. Всяко ястие е приготвено лично, с продукти от близкия пазар и точни мерки, за да можете да го сготвите и във вашата кухня.")}
            </p>
            <Link href="/za-ivo" className="mt-5 inline-flex min-h-12 items-center gap-2 rounded-full bg-on-garden px-5 py-2 font-semibold text-garden hover:underline">
              Повече за мен
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </Band>

      <Band tone="sage" pattern innerClassName="py-12 sm:py-16">
        <div className="rounded-3xl border border-border-subtle bg-butter p-6 shadow-card sm:p-10">
          <SubscribeForm />
        </div>
      </Band>
    </div>
  );
}
