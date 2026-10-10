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

/** The flour sack at the bottom of the shelf: kraft paper, one-ink print. */
export function Footer() {
  return (
    <footer className="lid-field border-t-[3px] border-rule bg-kraft text-[#14161a]">
      {/* The doodle band sits in its own strip so no text ever lands on it. */}
      <div className="relative h-24 border-b-2 border-[#14161a]">
        <CookingBackground className="absolute inset-0 text-[#14161a]" opacity={0.55} scale={0.42} />
      </div>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="font-heading text-4xl font-extrabold uppercase leading-[0.95] tracking-wide sm:text-5xl">
            Кулинарният блог на Иво
          </p>
          <p className="mt-3 max-w-md text-base">
            Домашни рецепти, изпробвани в собствената ми кухня — за всеки, който
            обича да готви за удоволствие.
          </p>
        </div>

        <nav aria-label="Долна навигация" className="flex flex-wrap border-2 border-[#14161a]">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex h-12 items-center border-r-2 border-[#14161a] px-5 font-heading text-lg font-bold uppercase tracking-wide transition-colors hover:bg-[#14161a] hover:text-kraft"
            >
              {link.label}
            </Link>
          ))}
          <a
            href="/rss.xml"
            className="flex h-12 items-center gap-2 px-5 font-heading text-lg font-bold uppercase tracking-wide transition-colors hover:bg-[#14161a] hover:text-kraft"
          >
            <Rss size={17} strokeWidth={2.5} />
            RSS
          </a>
        </nav>
      </div>

      <div className="border-t-2 border-[#14161a]">
        <p className="mx-auto max-w-6xl px-4 py-4 text-sm font-semibold tabular-nums sm:px-6">
          © <CopyrightYear /> Кулинарният блог на Иво
        </p>
      </div>
    </footer>
  );
}
