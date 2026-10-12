import Link from "next/link";
import { cacheLife } from "next/cache";
import { Rss } from "lucide-react";
import { CookingBackground } from "@/components/CookingBackground";

// Cached so reading the clock doesn't block the footer, and the page above
// it, from being prerendered into the static shell.
async function CopyrightYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

const links = [
  { href: "/recepti", label: "Рецепти" },
  { href: "/za-ivo", label: "За Иво" },
];

export function Footer() {
  return (
    <footer className="mt-24 bg-surface-muted">
      {/* The doodle band sits in its own strip so no text ever lands on it. */}
      <div className="relative h-20 text-muted-foreground">
        <CookingBackground className="absolute inset-0" opacity={0.45} scale={0.4} />
      </div>

      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-heading font-bold tracking-tight">Кулинарният блог на Иво</p>
          <p className="mt-2 max-w-md text-muted-foreground">
            Домашни рецепти, изпробвани в собствената ми кухня — за всеки, който
            обича да готви за удоволствие.
          </p>
        </div>

        <nav aria-label="Долна навигация" className="flex flex-wrap gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex h-11 items-center rounded-full px-4 font-medium transition-colors hover:bg-background"
            >
              {link.label}
            </Link>
          ))}
          <a
            href="/rss.xml"
            className="flex h-11 items-center gap-2 rounded-full px-4 font-medium transition-colors hover:bg-background"
          >
            <Rss size={17} />
            RSS
          </a>
        </nav>
      </div>

      <p className="mx-auto max-w-6xl px-4 pb-8 text-small text-muted-foreground tabular-nums sm:px-6">
        © <CopyrightYear /> Кулинарният блог на Иво
      </p>
    </footer>
  );
}
