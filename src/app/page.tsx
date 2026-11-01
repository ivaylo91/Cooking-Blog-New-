import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Band } from "@/components/Band";
import { RecipeCard } from "@/components/RecipeCard";
import { ResumeCooking } from "@/components/ResumeCooking";
import { SectionHead } from "@/components/SectionHead";
import { SubscribeForm } from "@/components/SubscribeForm";
import { categoryTint, inCooksOrder } from "@/lib/categories";
import { getRecipes, getStockedCategories } from "@/lib/recipes";
import { keepShortWords } from "@/lib/typography";
import ivoPhoto from "@/app/za-ivo/ivo.jpg";

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

  return (
    <div>
      <Band tone="plain" innerClassName="pb-8 pt-8 sm:pb-10 sm:pt-10">
        <div className="grid gap-3 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:gap-16">
          <h1 className="animate-rise max-w-xl text-section font-bold">
            {keepShortWords("Домашни рецепти от моята кухня")}
          </h1>
          <p className="animate-rise max-w-xl text-body text-muted-foreground">
            {keepShortWords("Сготвени лично, с точни мерки и ясни стъпки. За всеки ден и за удоволствието от добрата храна.")}
          </p>
        </div>
        <ResumeCooking />

        {lead && (
          <section aria-label="Най-нова рецепта" className="mt-7 sm:mt-8">
            <RecipeCard recipe={lead} size="feature" priority />
          </section>
        )}
      </Band>

      {categories.length > 0 && (
        <Band tone="plain" aria-labelledby="shelf-head">
          <div className="border-y border-border-subtle py-6">
            <h2 id="shelf-head" className="mb-3 text-body font-semibold">Разгледайте по категория</h2>
            <ul className="flex flex-wrap gap-2">
              {inCooksOrder(categories).map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/recepti?category=${category.slug}`}
                    className="inline-flex min-h-11 items-center gap-2.5 rounded-full border border-border-subtle bg-surface px-4 py-2 text-small font-medium transition-colors hover:border-field-border hover:bg-surface-muted"
                  >
                    <span
                      aria-hidden="true"
                      style={{ backgroundColor: categoryTint(category.slug) }}
                      className="size-3 rounded-full ring-1 ring-border-subtle"
                    />
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Band>
      )}

      {(latest.length > 0 || recipes.length === 0) && (
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
        <Band tone="plain" className="border-t border-border-subtle" innerClassName="py-12 sm:py-16" aria-labelledby="top-head">
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

      <Band tone="plain" className="bg-surface-muted" innerClassName="py-12 sm:py-16" aria-labelledby="about-head">
        <div className="grid gap-6 sm:grid-cols-[10rem_minmax(0,1fr)] sm:items-center sm:gap-10 lg:grid-cols-[12rem_minmax(0,1fr)] lg:gap-14">
          <div className="relative aspect-square w-36 overflow-hidden rounded-2xl sm:w-full">
            <Image
              src={ivoPhoto}
              alt="Иво в кухнята си"
              fill
              placeholder="blur"
              sizes="(min-width: 1024px) 192px, (min-width: 640px) 160px, 144px"
              className="origin-top scale-125 object-cover"
            />
          </div>
          <div>
            <h2 id="about-head" className="text-section font-bold">Здравейте, аз съм Иво</h2>
            <p className="mt-4 max-w-2xl text-muted-foreground">
              {keepShortWords("Готвя у дома и тук събирам рецептите си. Всяко ястие е приготвено лично, с продукти от близкия пазар и точни мерки, за да можете да го сготвите и във вашата кухня.")}
            </p>
            <Link href="/za-ivo" className="mt-4 inline-flex min-h-11 items-center gap-2 font-semibold text-link hover:underline">
              Повече за мен
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </Band>

      <Band tone="plain" innerClassName="py-12 sm:py-16">
        <SubscribeForm />
      </Band>
    </div>
  );
}
