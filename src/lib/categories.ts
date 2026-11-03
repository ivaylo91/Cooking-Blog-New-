import {
  CakeSlice,
  Cherry,
  CookingPot,
  Croissant,
  Leaf,
  Salad,
  Soup,
  type LucideIcon,
} from "lucide-react";
import type { Category } from "@/types/recipe";

/**
 * Every shelf in one place, in a cook's order, not the alphabet: what you make
 * on a Tuesday first, what you make for a holiday or a jar in September last.
 *
 * `tint` is the shelf's food colour, as the name of a warm section token in
 * globals.css (light and dark versions defined there). Used for card bodies,
 * category chips and the recipe header, so colour also tells you the shelf.
 * `icon` is one drawn sign per shelf, so a category is recognised before it is
 * read.
 */
const SHELVES: { slug: string; tint: string; icon: LucideIcon }[] = [
  { slug: "osnovni-yastia", tint: "peach", icon: CookingPot },
  { slug: "supi", tint: "butter", icon: Soup },
  { slug: "salati", tint: "sage", icon: Salad },
  { slug: "testeni", tint: "wheat", icon: Croissant },
  { slug: "postni", tint: "olive", icon: Leaf },
  { slug: "deserti", tint: "rose", icon: CakeSlice },
  { slug: "konservi", tint: "sky", icon: Cherry },
];

function shelfIndex(slug: string | null | undefined): number {
  return SHELVES.findIndex((shelf) => shelf.slug === slug);
}

export function inCooksOrder(categories: Category[]): Category[] {
  const rank = (slug: string) => {
    const index = shelfIndex(slug);
    return index === -1 ? SHELVES.length : index;
  };
  return [...categories].sort((a, b) => rank(a.slug) - rank(b.slug));
}

export function categoryTint(slug: string | null | undefined): string {
  return `var(--${SHELVES[shelfIndex(slug)]?.tint ?? "peach"})`;
}

/**
 * Each shelf's sign by slug. A plain lookup rather than a function, so React's
 * lint can see the component is static and not created during render.
 */
export const CATEGORY_ICONS: Record<string, LucideIcon> = Object.fromEntries(
  SHELVES.map((shelf) => [shelf.slug, shelf.icon])
);
