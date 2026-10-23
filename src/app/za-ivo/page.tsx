import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { keepShortWords } from "@/lib/typography";
import ivoPhoto from "./ivo.jpg";

export const metadata: Metadata = {
  title: "За Иво",
  description: "Здравейте! Тук споделям домашни рецепти, изпробвани в собствената ми кухня.",
  alternates: { canonical: "/za-ivo" },
};

// How the recipes are made, in Иво's own voice. Each line is a claim he
// stands behind; nothing here may be added without him.
const howICook = [
  "Всяка рецепта тук съм приготвил лично и съм я снимал на моя кухненски плот. Няма свалени от интернет снимки и непроверени преводи.",
  "Грамажите, лъжиците и бройките са претеглени при истинско готвене, за да се получи вкусно още от първия опит.",
  "Готвя с обикновена фурна и тиган и с продукти от близкия пазар. Рецептите са за всеки ден и за празник, без сложни уреди и техники.",
  "Сайтът е мислен за готвене от телефона. Режимът „Готви стъпка по стъпка“ показва по една стъпка с едър шрифт, таймерите са вградени в стъпките, а екранът не угасва, докато ръцете ви са заети.",
];

export default function ZaIvoPage() {
  return (
    <>
      {/* The person behind the recipes, upright and large: a face is the
          strongest proof that "tried in my kitchen" is meant literally. */}
      <div className="bg-peach">
        <div className="animate-rise mx-auto grid max-w-6xl items-center gap-8 px-4 pb-12 pt-8 sm:px-6 sm:pb-16 sm:pt-12 md:grid-cols-[minmax(0,1fr)_18rem] lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-14">
          <div>
            <h1 className="text-display font-bold leading-[1.05]">
              {keepShortWords("Домашни рецепти за удоволствие от готвенето")}
            </h1>
            <p className="mt-5 max-w-2xl text-heading leading-snug">
              {keepShortWords(
                "Здравейте! Аз съм Иво. Този блог събира моята лична колекция от изпитани домашни ястия, десерти, супи и тестени изкушения."
              )}
            </p>
          </div>

          <figure className="w-64 sm:w-72 md:w-full">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-lift">
              <Image
                src={ivoPhoto}
                alt="Иво в кухнята си"
                fill
                loading="eager"
                placeholder="blur"
                sizes="(min-width: 1024px) 22rem, (min-width: 768px) 18rem, 18rem"
                className="object-cover"
              />
            </div>
          </figure>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-20 pt-12 sm:px-6 sm:pt-16">
        <section aria-labelledby="how-head" className="max-w-[65ch]">
          <h2 id="how-head" className="text-heading font-bold">
            Как готвя
          </h2>
          <div className="mt-4 flex flex-col gap-4 text-body leading-relaxed">
            {howICook.map((line) => (
              <p key={line}>{keepShortWords(line)}</p>
            ))}
          </div>
        </section>

        <section
          aria-labelledby="cooked-head"
          className="mt-14 flex flex-col items-start gap-5 border-t border-border-subtle pt-10 md:flex-row md:items-center md:justify-between"
        >
          <div className="max-w-xl">
            <h2 id="cooked-head" className="text-heading font-bold">
              Сготвихте ли някоя рецепта?
            </h2>
            <p className="mt-2 text-body text-muted-foreground">
              {keepShortWords(
                "Оставете коментар или оценка под рецептата. Винаги се радвам да чуя как се е получило и какво сте променили."
              )}
            </p>
          </div>
          <Link
            href="/recepti"
            className="inline-flex h-14 shrink-0 items-center gap-2 rounded-full bg-accent px-7 text-body font-semibold text-accent-foreground shadow-card transition-[background-color,transform] hover:bg-accent-strong active:scale-[0.97]"
          >
            Към рецептите
            <ArrowRight size={20} aria-hidden="true" />
          </Link>
        </section>
      </div>
    </>
  );
}
