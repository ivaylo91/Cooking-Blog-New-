import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <div className="border-2 border-rule">
        <div className="p-5 sm:p-8">
          <h1 className="font-heading text-[clamp(2.75rem,11vw,6rem)] font-black uppercase leading-[0.88] [text-wrap:balance]">
            Тази страница липсва от менюто
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted-foreground">
            Рецептата или страницата, която търсите, не съществува или е преместена.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/recepti"
              className="inline-flex h-14 items-center gap-2 bg-accent px-6 font-heading text-xl font-extrabold uppercase tracking-wide text-accent-foreground transition-colors hover:bg-accent-strong"
            >
              Към рецептите
              <ArrowRight size={22} strokeWidth={2.5} />
            </Link>
            <Link
              href="/"
              className="inline-flex h-14 items-center border-2 border-rule px-6 font-heading text-xl font-extrabold uppercase tracking-wide transition-colors hover:bg-surface-muted"
            >
              Начало
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
