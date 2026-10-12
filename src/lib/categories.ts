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
