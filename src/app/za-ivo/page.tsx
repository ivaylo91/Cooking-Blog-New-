import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CookingBackground } from "@/components/CookingBackground";
import { Stamp } from "@/components/Stamp";

export const metadata: Metadata = {
  title: "За Иво",
  description: "Здравейте! Тук споделям домашни рецепти, изпробвани в собствената ми кухня.",
  alternates: { canonical: "/za-ivo" },
};

export default function ZaIvoPage() {
  return (
    <div>
      <section className="lid-field border-b-[3px] border-rule bg-brand text-white">
        <div className="relative h-14 border-b-2 border-white/35">
          <CookingBackground className="absolute inset-0 text-white" opacity={0.4} scale={0.36} />
        </div>
        <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-8 px-4 py-10 sm:px-6 sm:py-14">
          <h1 className="font-heading text-[clamp(4rem,20vw,6rem)] font-black uppercase leading-[0.85]">
            За Иво
          </h1>
          <Stamp size={124} />
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr]">
        <p className="max-w-[34ch] font-heading text-[2rem] font-bold leading-[1.3] sm:text-[2.5rem]">
          Здравейте! Тук споделям домашни рецепти, изпробвани в собствената ми
          кухня — за всеки, който обича да готви за удоволствие.
        </p>

        <div className="self-start border-2 border-rule">
          <Link
            href="/recepti"
            className="flex h-14 items-center justify-between px-4 font-heading text-xl font-extrabold uppercase tracking-wide transition-colors hover:bg-foreground hover:text-background"
          >
            Към рецептите
            <ArrowRight size={22} strokeWidth={2.5} />
          </Link>
        </div>
      </div>
    </div>
  );
}
