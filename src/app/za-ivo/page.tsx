import type { Metadata } from "next";
import { ChefHat } from "lucide-react";

export const metadata: Metadata = {
  title: "За Иво",
};

export default function ZaIvoPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <div className="rounded-2xl border border-border-subtle bg-surface p-8 text-center">
        <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft text-accent-strong">
          <ChefHat size={26} strokeWidth={1.75} />
        </span>
        <h1 className="font-heading text-2xl font-semibold">За Иво</h1>
        <p className="mt-4 text-muted-foreground">
          Здравейте! Тук споделям домашни рецепти, изпробвани в собствената ми
          кухня — за всеки, който обича да готви за удоволствие.
        </p>
      </div>
    </div>
  );
}
