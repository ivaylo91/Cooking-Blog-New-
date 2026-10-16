"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { ChefHat, Mail, MessageSquare, Settings } from "lucide-react";

const sections = [
  { href: "/admin", label: "Рецепти", icon: ChefHat },
  { href: "/admin/comments", label: "Коментари", icon: MessageSquare },
  { href: "/admin/subscribers", label: "Абонати", icon: Mail },
  { href: "/admin/settings", label: "Настройки", icon: Settings },
];

/** Recipes own /admin itself and every /admin/recipes/... editor page. */
function isActive(href: string, pathname: string | null) {
  if (!pathname) return false;
  if (href === "/admin") return pathname === "/admin" || pathname.startsWith("/admin/recipes");
  return pathname.startsWith(href);
}

function Links({ pathname }: { pathname: string | null }) {
  return sections.map(({ href, label, icon: Icon }) => {
    const active = isActive(href, pathname);
    return (
      <li key={href}>
        <Link
          href={href}
          aria-current={active ? "page" : undefined}
          className={`flex h-11 items-center gap-2 whitespace-nowrap rounded-full px-4 font-medium transition-colors ${
            active ? "bg-foreground text-background" : "hover:bg-surface-muted"
          }`}
        >
          <Icon size={17} aria-hidden="true" />
          {label}
        </Link>
      </li>
    );
  });
}

function ActiveLinks() {
  return <Links pathname={usePathname()} />;
}

/**
 * The admin sections as labelled tabs, the current one filled. One row that
 * scrolls sideways on a phone rather than wrapping.
 */
export function AdminNav() {
  return (
    <nav aria-label="Администрация" className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <ul className="flex gap-1">
        {/* The path is only known at request time; the tabs render unhighlighted
            in the prerendered shell and light up once it streams. */}
        <Suspense fallback={<Links pathname={null} />}>
          <ActiveLinks />
        </Suspense>
      </ul>
    </nav>
  );
}
