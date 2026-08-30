import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-black/10 dark:border-white/10">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Кулинарният блог на Иво
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/recepti" className="hover:underline">
            Рецепти
          </Link>
          <Link href="/za-ivo" className="hover:underline">
            За Иво
          </Link>
          <form action="/tarsene" className="hidden sm:block">
            <input
              type="search"
              name="q"
              placeholder="Търсене..."
              className="w-40 rounded-full border border-black/10 bg-transparent px-3 py-1.5 text-sm outline-none focus:border-black/30 dark:border-white/15 dark:focus:border-white/40"
            />
          </form>
        </nav>
      </div>
    </header>
  );
}
