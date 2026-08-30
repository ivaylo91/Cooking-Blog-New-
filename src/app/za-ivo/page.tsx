import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "За Иво",
};

export default function ZaIvoPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="mb-4 text-2xl font-semibold">За Иво</h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        Здравейте! Тук споделям домашни рецепти, изпробвани в собствената ми
        кухня — за всеки, който обича да готви за удоволствие.
      </p>
    </div>
  );
}
