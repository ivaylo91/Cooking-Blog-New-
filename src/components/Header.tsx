"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { Menu, Search, X } from "lucide-react";
import { LogoMark } from "@/components/Logo";
import { SearchField } from "@/components/SearchField";
import { ThemeToggle } from "@/components/ThemeToggle";

import { categoryTint } from "@/lib/categories";
import type { Category } from "@/types/recipe";

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

/** On a phone the header opens one panel at a time: the menu or the search. */
type Panel = "menu" | "search" | null;

export function Header({ categories }: { categories: Category[] }) {
  const [panel, setPanel] = useState<Panel>(null);
  const headerRef = useRef<HTMLElement>(null);
  const menuOpen = panel === "menu";
  const searchOpen = panel === "search";
  const close = () => setPanel(null);
  const toggle = (next: Exclude<Panel, null>) => setPanel((p) => (p === next ? null : next));

  useEffect(() => {
    if (!panel) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setPanel(null);
    }
    // A tap on the page below closes the panel, as on any app's menu.
    function onPointerDown(event: PointerEvent) {
      if (!headerRef.current?.contains(event.target as Node)) setPanel(null);
    }
    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [panel]);

  return (
    <header ref={headerRef} className="sticky top-0 z-40 border-b border-border-subtle bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-(--header-h) max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="logo-link flex h-11 min-w-0 items-center gap-2.5"
          onClick={close}
        >
          <LogoMark size={38} />
          {/* With search and menu beside it, a phone has room for the name only
              on two lines; it breaks before "на Иво" rather than cutting off. */}
          <span className="text-small font-bold leading-tight tracking-tight sm:truncate sm:text-body">
            Кулинарният блог <span className="whitespace-nowrap">на Иво</span>
          </span>
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

        {/* Search is the main way into a recipe site, so on a phone it sits
            in the bar rather than inside the menu. */}
        <div className="flex shrink-0 items-center md:hidden">
          <button
            type="button"
            onClick={() => toggle("search")}
            className="flex size-11 items-center justify-center rounded-full transition-colors hover:bg-surface-muted"
            aria-label={searchOpen ? "Затвори търсенето" : "Търсене"}
            aria-expanded={searchOpen}
            aria-controls="mobile-search"
          >
            {searchOpen ? <X size={22} /> : <Search size={22} />}
          </button>
          <button
            type="button"
            onClick={() => toggle("menu")}
            className="flex size-11 items-center justify-center rounded-full transition-colors hover:bg-surface-muted"
            aria-label={menuOpen ? "Затвори менюто" : "Отвори менюто"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div
          id="mobile-search"
          className="animate-rise border-t border-border-subtle bg-background px-4 pb-4 pt-3 md:hidden"
        >
          <SearchField id="search-mobile" autoFocus />
        </div>
      )}

      {menuOpen && (
        <div id="mobile-menu" className="animate-rise border-t border-border-subtle bg-background md:hidden">
          <nav aria-label="Основна навигация" className="flex flex-col px-2 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={close}
                className="flex h-14 items-center rounded-xl px-3 text-heading font-semibold"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          {categories.length > 0 && (
            <div className="border-t border-border-subtle px-4 py-3">
              <p className="text-small font-semibold text-muted-foreground">Категории</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {categories.map((c) => (
                  <Link
                    key={c.id}
                    href={`/recepti?category=${c.slug}`}
                    onClick={close}
                    style={{ backgroundColor: categoryTint(c.slug) }}
                    className="flex h-11 items-center rounded-full px-4 text-small font-medium transition-transform active:scale-95"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
          <div className="flex items-center justify-between border-t border-border-subtle px-4 pb-4 pt-3">
            <span className="font-medium">Тема</span>
            <ThemeToggle />
          </div>
        </div>
      )}
    </header>
  );
}
