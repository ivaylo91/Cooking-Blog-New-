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
        size={17}
        strokeWidth={2.25}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
      />
      <input
        id={id}
        type="search"
        name="q"
        placeholder="Търсене"
        className="h-11 w-full border-2 border-rule bg-surface pl-10 pr-3 text-base outline-none transition-colors placeholder:text-muted-foreground focus:border-accent"
      />
    </form>
  );
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b-[3px] border-rule bg-background">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        {/* The blog's own lid: its name printed on a cobalt panel. */}
        <Link
          href="/"
          className="flex h-11 min-w-0 items-center bg-brand px-3 font-heading text-[1.35rem] font-extrabold uppercase leading-none tracking-wide text-white"
          onClick={() => setMenuOpen(false)}
        >
          <span className="truncate">Кулинарният блог на Иво</span>
        </Link>

        <nav aria-label="Основна навигация" className="hidden items-center gap-2 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex h-11 items-center px-3 font-heading text-lg font-bold uppercase tracking-wide underline-offset-[6px] hover:underline"
            >
              {link.label}
            </Link>
          ))}
          <SearchField id="search-desktop" className="w-52" />
          <ThemeToggle />
        </nav>

        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className="flex h-11 w-11 shrink-0 items-center justify-center border-2 border-rule md:hidden"
          aria-label={menuOpen ? "Затвори менюто" : "Отвори менюто"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          {menuOpen ? <X size={20} strokeWidth={2.25} /> : <Menu size={20} strokeWidth={2.25} />}
        </button>
      </div>

      {menuOpen && (
        <div id="mobile-menu" className="border-t-2 border-rule bg-background md:hidden">
          <nav aria-label="Основна навигация" className="flex flex-col">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="flex h-14 items-center border-b border-border-subtle px-4 font-heading text-2xl font-bold uppercase tracking-wide"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3 px-4 py-4">
            <SearchField id="search-mobile" className="flex-1" />
            <ThemeToggle />
          </div>
        </div>
      )}
    </header>
  );
}
