import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "За Иво",
  description: "Здравейте! Тук споделям домашни рецепти, изпробвани в собствената ми кухня.",
  alternates: { canonical: "/za-ivo" },
};

export default function ZaIvoPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 sm:pt-12">
      <h1 className="text-display font-bold leading-[1.05]">За Иво</h1>
      <p className="mt-6 max-w-[38ch] text-heading leading-snug">
        Здравейте! Тук споделям домашни рецепти, изпробвани в собствената ми
        кухня — за всеки, който обича да готви за удоволствие.
      </p>
      <Link
        href="/recepti"
        className="mt-8 inline-flex h-14 items-center gap-2 rounded-full bg-accent px-7 text-body font-semibold text-accent-foreground transition-colors hover:bg-accent-strong"
      >
        Към рецептите
        <ArrowRight size={20} />
      </Link>
    </div>
  );
}
