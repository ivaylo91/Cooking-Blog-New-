import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AuthorPortrait } from "@/components/AuthorPortrait";
import { Band } from "@/components/Band";
import { JsonLd } from "@/components/JsonLd";
import { RecipeCard } from "@/components/RecipeCard";
import { SectionHead } from "@/components/SectionHead";
import { primaryAction } from "@/components/styles";
import { recipeCount } from "@/lib/format";
import { getRecipes, getStockedCategories } from "@/lib/recipes";
import { keepShortWords } from "@/lib/typography";
import ivoPhoto from "@/components/ivo.jpg";

export const metadata: Metadata = {
  title: "За Иво",
  description:
    "Иво е авторът на Кулинарния блог: домашни рецепти, сготвени и снимани в собствената му кухня, с точни мерки и ясни стъпки.",
  alternates: { canonical: "/za-ivo" },
};

// How the recipes are made, in Иво's own voice. Each line is a claim he has
// confirmed; nothing here may be added without him.
const principles = [
  {
    title: "Всичко е изпитано",
    text: "Всяка рецепта съм приготвил лично и съм снимал на моя кухненски плот. Няма свалени от интернет снимки и непроверени преводи.",
  },
  {
    title: "Мерките са точни",
    text: "Грамажите, лъжиците и бройките са претеглени при истинско готвене, за да се получи вкусно още от първия опит.",
  },
  {
    title: "Кухнята е обикновена",
    text: "Готвя с обикновена фурна и тиган и с продукти от близкия пазар. Рецептите са за всеки ден и за празник, без сложни уреди и техники.",
  },
  {
    title: "Удобно е за готвене",
    text: "Сайтът е мислен за телефон: „Готви стъпка по стъпка“ показва по една стъпка с едър шрифт, таймерите са вградени, а екранът не угасва, докато ръцете ви са заети.",
  },
];

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// The author behind every recipe's byline, so search engines can tie the
// recipes to one real person.
const profileJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  url: `${siteUrl}/za-ivo`,
  inLanguage: "bg",
  mainEntity: {
    "@type": "Person",
    name: "Иво",
    url: `${siteUrl}/za-ivo`,
    image: `${siteUrl}${ivoPhoto.src}`,
    description: "Автор на Кулинарния блог на Иво: домашни рецепти, сготвени и снимани в собствената му кухня.",
  },
};

export default async function ZaIvoPage() {
  const [recipes, categories] = await Promise.all([getRecipes(), getStockedCategories()]);
  const newest = recipes.slice(0, 3);

  return (
    <>
      <JsonLd data={profileJsonLd} />
      {/* Who, what and the proof, then the way in. The portrait is cropped to
          head and shoulders, so the face carries it. */}
      <div className="bg-peach">
        <div className="animate-rise mx-auto grid max-w-6xl items-center gap-8 px-4 pb-12 pt-8 sm:px-6 sm:pb-16 sm:pt-12 md:grid-cols-[minmax(0,1fr)_17rem] lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-14">
          <div>
            <h1 className="text-display font-bold leading-[1.05]">Здравейте, аз съм Иво</h1>
            <p className="mt-5 max-w-2xl text-heading leading-snug">
              {keepShortWords(
                "Готвя у дома и тук събирам рецептите си: домашни ястия, супи, салати, тестени изделия и десерти."
              )}
            </p>
            <p className="mt-4 font-semibold tabular-nums">
              {recipeCount(recipes.length)} в {categories.length}{" "}
              {categories.length === 1 ? "категория" : "категории"}
            </p>
            <Link
              href="/recepti"
              className={`mt-6 shadow-card ${primaryAction}`}
            >
              Към рецептите
              <ArrowRight size={20} aria-hidden="true" />
            </Link>
          </div>

          <AuthorPortrait
            className="w-56 shadow-lift ring-4 ring-surface sm:w-64 md:w-full"
            sizes="(min-width: 1024px) 20rem, (min-width: 768px) 17rem, 16rem"
            priority
          />
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <section
          aria-labelledby="how-head"
          className="grid gap-x-12 gap-y-6 lg:grid-cols-[minmax(0,14rem)_minmax(0,1fr)]"
        >
          <h2 id="how-head" className="text-section font-bold">
            Как готвя
          </h2>
          <div className="grid gap-x-10 gap-y-8 md:grid-cols-2">
            {principles.map((item) => (
              <div key={item.title} className="border-t-2 border-accent pt-4">
                <h3 className="text-heading font-bold">{item.title}</h3>
                <p className="mt-2 text-body leading-relaxed text-muted-foreground">
                  {keepShortWords(item.text)}
                </p>
              </div>
            ))}
          </div>
        </section>

        {newest.length > 0 && (
          <section aria-labelledby="newest-head" className="mt-16">
            <SectionHead
              title="Започнете оттук"
              id="newest-head"
              action={{ href: "/recepti", label: "Всички рецепти" }}
            />
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {newest.map((recipe, index) => (
                <RecipeCard key={recipe.id} recipe={recipe} index={index} />
              ))}
            </div>
          </section>
        )}
      </div>

      <Band tone="butter" innerClassName="py-12">
        <h2 className="text-section font-bold">Сготвихте ли някоя рецепта?</h2>
        <p className="mt-2 max-w-[65ch] text-body text-muted-foreground">
          {keepShortWords(
            "Оставете коментар или оценка под рецептата. Винаги се радвам да чуя как се е получило и какво сте променили."
          )}
        </p>
      </Band>
    </>
  );
}
