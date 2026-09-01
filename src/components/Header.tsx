"use client";

import Link from "next/link";
import { useState } from "react";
import { ChefHat, Menu, Search, X } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

const navLinks = [
  { href: "/recepti", label: "Рецепти" },
  { href: "/za-ivo", label: "За Иво" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border-subtle bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-accent-foreground">
            <ChefHat size={18} strokeWidth={2.25} />
          </span>
          <span className="font-heading text-lg font-semibold tracking-tight">
            Кулинарният блог на Иво
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium sm:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-accent">
              {link.label}
            </Link>
          ))}
          <form action="/tarsene" className="relative">
            <Search
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="search"
              name="q"
              placeholder="Търсене..."
              className="w-44 rounded-full border border-border-subtle bg-surface py-1.5 pl-8 pr-3 text-sm outline-none transition focus:border-accent"
            />
          </form>
          <ThemeToggle />
        </nav>

        <div className="flex items-center gap-2 sm:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border-subtle"
            aria-label={menuOpen ? "Затвори менюто" : "Отвори менюто"}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-border-subtle bg-background px-6 py-4 sm:hidden">
          <nav className="flex flex-col gap-3 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="py-1"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <form action="/tarsene" className="relative mt-3">
            <Search
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="search"
              name="q"
              placeholder="Търсене..."
              className="w-full rounded-full border border-border-subtle bg-surface py-2 pl-8 pr-3 text-sm outline-none focus:border-accent"
            />
          </form>
        </div>
      )}
    </header>
  );
}
