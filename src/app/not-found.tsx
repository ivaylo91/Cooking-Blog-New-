import Link from "next/link";
import { ChefHat } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-20 text-center">
      <div className="rounded-2xl border border-border-subtle bg-surface p-10">
        <span className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent-soft text-accent-strong">
          <ChefHat size={28} strokeWidth={1.75} />
        </span>
        <h1 className="font-heading text-3xl font-bold">404</h1>
        <p className="mt-2 text-lg font-medium">Тази страница липсва от менюто</p>
        <p className="mt-2 text-muted-foreground">
          Рецептата или страницата, която търсите, не съществува или е преместена.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition hover:bg-accent-strong"
        >
          Обратно към началото
        </Link>
      </div>
    </div>
  );
}
