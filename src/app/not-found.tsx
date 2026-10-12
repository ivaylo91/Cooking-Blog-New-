import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-12 sm:px-6 sm:pt-20">
      <h1 className="max-w-3xl text-display font-bold leading-[1.05]">
        Тази страница липсва от менюто
      </h1>
      <p className="mt-4 max-w-xl text-body text-muted-foreground">
        Рецептата или страницата, която търсите, не съществува или е преместена.
      </p>
      <div className="mt-8 flex flex-wrap gap-2">
        <Link
          href="/recepti"
          className="inline-flex h-14 items-center gap-2 rounded-full bg-accent px-7 text-body font-semibold text-accent-foreground transition-colors hover:bg-accent-strong"
        >
          Към рецептите
          <ArrowRight size={20} />
        </Link>
        <Link
          href="/"
          className="inline-flex h-14 items-center rounded-full bg-surface-muted px-7 text-body font-semibold transition-colors hover:bg-border-subtle"
        >
          Начало
        </Link>
      </div>
    </div>
  );
}
