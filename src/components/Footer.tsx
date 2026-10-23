import Link from "next/link";
import { cacheLife } from "next/cache";
import { Rss } from "lucide-react";
import { CookingBackground } from "@/components/CookingBackground";
import { inCooksOrder } from "@/lib/categories";
import { getNavCategories } from "@/lib/recipes";

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

export async function Footer() {
  // Cached, like the header's read, so the footer stays in the static shell.
  const categories = inCooksOrder(await getNavCategories());

  return (
    <footer className="bg-wheat print:hidden">
      {/* The doodle band sits in its own strip so no text ever lands on it. */}
      <div className="relative h-20 text-muted-foreground">
        <CookingBackground className="absolute inset-0" opacity={0.45} scale={0.4} />
      </div>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_auto] md:items-start">
        <div>
          <p className="font-heading text-heading font-bold">Кулинарният блог на Иво</p>
          <p className="mt-2 max-w-md text-muted-foreground">
            Домашни рецепти, изпробвани в собствената ми кухня. За всеки, който
            обича да готви за удоволствие.
          </p>
        </div>

        {/* Every shelf one tap away from the bottom of any page. */}
        {categories.length > 0 && (
          <nav aria-labelledby="footer-categories">
            <p id="footer-categories" className="text-small font-semibold text-muted-foreground">
              Категории
            </p>
            <ul className="mt-1 grid grid-cols-2 gap-x-6">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/recepti?category=${category.slug}`}
                    className="flex h-11 items-center font-medium hover:underline"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {/* Labelled and styled like the category column beside it, so the two
            line up as a pair. */}
        <nav aria-labelledby="footer-blog">
          <p id="footer-blog" className="text-small font-semibold text-muted-foreground">
            Блогът
          </p>
          <ul className="mt-1 grid grid-cols-2 gap-x-6 md:grid-cols-1">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="flex h-11 items-center font-medium hover:underline">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <a href="/rss.xml" className="flex h-11 items-center gap-2 font-medium hover:underline">
                <Rss size={17} aria-hidden="true" />
                RSS
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <p className="mx-auto max-w-6xl px-4 pb-8 text-small text-muted-foreground tabular-nums sm:px-6">
        © <CopyrightYear /> Кулинарният блог на Иво
      </p>
    </footer>
  );
}
