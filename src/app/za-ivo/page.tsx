import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Flame, HeartHandshake, Sparkles, Utensils } from "lucide-react";
import { LogoMark } from "@/components/Logo";

export const metadata: Metadata = {
  title: "За Иво",
  description: "Здравейте! Тук споделям домашни рецепти, изпробвани в собствената ми кухня.",
  alternates: { canonical: "/za-ivo" },
};

const commitments = [
  {
    icon: Utensils,
    title: "100% изпробвано в моята кухня",
    description:
      "Всяка рецепта тук е приготвена лично и снимана на моя кухненски плот. Без свалени от интернет снимки или непроверени преводи.",
  },
  {
    icon: CheckCircle2,
    title: "Точни и готвими мерки",
    description:
      "Всички грамажи, лъжици и бройки са претеглени в реално готвене, за да се получат вкусни резултати от първия опит.",
  },
  {
    icon: Flame,
    title: "Без сложни уреди и техники",
    description:
      "Рецепти за всеки ден и за празник, които се приготвят с обикновена фурна, тиган и лесно достъпни продукти от близкия пазар.",
  },
  {
    icon: Sparkles,
    title: "Мислено за готвене от телефона",
    description:
      "Специален режим „Готви стъпка по стъпка“, вградени таймери и екран, който не гасне, докато ръцете ви са заети.",
  },
];

export default function ZaIvoPage() {
  return (
    <div className="bg-peach">
      <div className="animate-rise mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6 sm:pb-24 sm:pt-12">
        <div className="flex flex-col items-start gap-4">
          <div className="flex items-center gap-3">
            <LogoMark size={46} />
            <span className="text-small font-bold uppercase tracking-wider text-muted-foreground">
              Кулинарният блог на Иво
            </span>
          </div>

          <h1 className="text-display font-bold leading-[1.05]">
            Домашни рецепти за удоволствие от готвенето
          </h1>

          <p className="mt-2 max-w-2xl text-heading leading-snug text-foreground/90">
            Здравейте! Този блог събира моята лична колекция от изпитани домашни ястия,
            десерти, супи и тестени изкушения.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {commitments.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-3xl border border-border-subtle bg-surface p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lift"
              >
                <div className="flex size-11 items-center justify-center rounded-2xl bg-accent-soft text-accent">
                  <Icon size={22} />
                </div>
                <h2 className="mt-4 text-heading font-bold">{item.title}</h2>
                <p className="mt-2 text-body text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-12 flex flex-col items-start gap-6 rounded-3xl border border-border-subtle bg-surface p-6 sm:p-8 md:flex-row md:items-center md:justify-between shadow-card">
          <div className="flex items-start gap-4">
            <div className="hidden size-12 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent sm:flex">
              <HeartHandshake size={24} />
            </div>
            <div>
              <h3 className="text-heading font-bold">Сготвихте ли някоя рецепта?</h3>
              <p className="mt-1 max-w-xl text-body text-muted-foreground">
                Оставете коментар или оценка под съответната рецепта – винаги се радвам да
                чуя как се е получило и какви промени сте направили.
              </p>
            </div>
          </div>

          <Link
            href="/recepti"
            className="inline-flex h-14 shrink-0 items-center gap-2 rounded-full bg-accent px-7 text-body font-semibold text-accent-foreground shadow-card transition-[background-color,transform] hover:bg-accent-strong active:scale-[0.97]"
          >
            Към рецептите
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
}
