"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useState } from "react";
import { Menu, X } from "lucide-react";
import { LogoMark } from "@/components/Logo";
import { SearchField } from "@/components/SearchField";
import { ThemeToggle } from "@/components/ThemeToggle";

const navLinks = [
  { href: "/recepti", label: "Рецепти" },
  { href: "/za-ivo", label: "За Иво" },
];

function ActiveDesktopLinks() {
  return <DesktopLinks pathname={usePathname()} />;
}

function DesktopLinks({ pathname }: { pathname: string | null }) {
  return navLinks.map((link) => {
    const active = pathname?.startsWith(link.href);
    return (
      <Link
        key={link.href}
        href={link.href}
        aria-current={active ? "page" : undefined}
        className={`flex h-11 items-center rounded-full px-4 font-medium transition-colors ${
          active ? "bg-accent-soft text-link" : "hover:bg-surface-muted"
        }`}
      >
        {link.label}
      </Link>
    );
  });
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border-subtle bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="logo-link flex h-11 min-w-0 items-center gap-2.5"
          onClick={() => setMenuOpen(false)}
        >
          <LogoMark size={38} />
          <span className="truncate text-body font-bold tracking-tight">Кулинарният блог на Иво</span>
        </Link>

        <nav aria-label="Основна навигация" className="hidden items-center gap-1 md:flex">
          {/* The current path is only known at request time; the links render
              unhighlighted in the prerendered shell and light up once it streams. */}
          <Suspense fallback={<DesktopLinks pathname={null} />}>
            <ActiveDesktopLinks />
          </Suspense>
          <SearchField id="search-desktop" className="ml-2 w-64" shortcut />
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
        <div id="mobile-menu" className="animate-rise border-t border-border-subtle bg-background md:hidden">
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
