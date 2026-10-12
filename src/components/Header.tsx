"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Search, X } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

const navLinks = [
  { href: "/recepti", label: "Рецепти" },
  { href: "/za-ivo", label: "За Иво" },
];

function SearchField({ id, className = "" }: { id: string; className?: string }) {
  return (
    <form action="/tarsene" role="search" className={`relative ${className}`}>
      <label htmlFor={id} className="sr-only">
        Търсене на рецепта
      </label>
      <Search
        size={18}
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
      />
      <input
        id={id}
        type="search"
        name="q"
        placeholder="Търсете рецепта"
        className="h-11 w-full rounded-full bg-surface-muted pl-10 pr-4 text-body outline-none ring-accent transition placeholder:text-muted-foreground focus:ring-2"
      />
    </form>
  );
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border-subtle bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="flex h-11 min-w-0 items-center truncate text-body font-bold tracking-tight"
          onClick={() => setMenuOpen(false)}
        >
          Кулинарният блог на Иво
        </Link>

        <nav aria-label="Основна навигация" className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex h-11 items-center rounded-full px-4 font-medium transition-colors hover:bg-surface-muted"
            >
              {link.label}
            </Link>
          ))}
          <SearchField id="search-desktop" className="ml-2 w-60" />
          <ThemeToggle />
        </nav>

        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className="flex size-11 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-surface-muted md:hidden"
          aria-label={menuOpen ? "Затвори менюто" : "Отвори менюто"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div id="mobile-menu" className="border-t border-border-subtle bg-background md:hidden">
          <nav aria-label="Основна навигация" className="flex flex-col px-2 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="flex h-14 items-center rounded-xl px-3 text-heading font-semibold"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2 px-4 pb-4 pt-2">
            <SearchField id="search-mobile" className="flex-1" />
            <ThemeToggle />
          </div>
        </div>
      )}
    </header>
  );
}
