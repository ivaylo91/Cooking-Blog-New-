import Link from "next/link";
import { ArrowRight, Home } from "lucide-react";
import { primaryAction } from "@/components/styles";

export default function NotFound() {
  return (
    <div className="bg-peach">
      <div className="animate-rise mx-auto max-w-6xl px-4 pt-12 sm:px-6 sm:pt-20 pb-16 sm:pb-24">
      <h1 className="max-w-3xl text-display font-bold leading-[1.05]">
        Тази страница липсва от менюто
      </h1>
      <p className="mt-4 max-w-xl text-body text-muted-foreground">
        Рецептата или страницата, която търсите, не съществува или е преместена.
      </p>
      <div className="mt-8 flex flex-wrap gap-2">
        <Link
          href="/recepti"
          className={primaryAction}
        >
          Към рецептите
          <ArrowRight size={20} aria-hidden="true" />
        </Link>
        <Link
          href="/"
          className="inline-flex h-14 items-center gap-2 rounded-full bg-surface px-7 text-body font-semibold shadow-card transition-[transform] active:scale-[0.97]"
        >
          <Home size={20} aria-hidden="true" />
          Начало
        </Link>
      </div>
    </div>
    </div>
  );
}
