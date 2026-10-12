import type { Category } from "@/types/recipe";

/**
 * A cook's order, not the alphabet: what you make on a Tuesday first, what
 * you make for a holiday or a jar in September last.
 */
const ORDER = ["osnovni-yastia", "supi", "salati", "testeni", "postni", "deserti", "konservi"];

export function inCooksOrder(categories: Category[]): Category[] {
  const rank = (slug: string) => {
    const index = ORDER.indexOf(slug);
    return index === -1 ? ORDER.length : index;
  };
  return [...categories].sort((a, b) => rank(a.slug) - rank(b.slug));
}

/**
 * Each category's food colour, as the name of a warm section token in
 * globals.css (light and dark versions defined there). Used for card bodies,
 * category chips and the recipe header, so colour also tells you the shelf.
 */
const TINTS: Record<string, string> = {
  "osnovni-yastia": "peach",
  supi: "butter",
  salati: "sage",
  testeni: "wheat",
  postni: "olive",
  deserti: "rose",
  konservi: "sky",
};

export function categoryTint(slug: string | null | undefined): string {
  return `var(--${(slug && TINTS[slug]) || "peach"})`;
}
