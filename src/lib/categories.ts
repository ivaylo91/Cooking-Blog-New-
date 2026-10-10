import type { Category } from "@/types/recipe";

/**
 * Each category is a product line with its own lid colour, the way a dairy
 * colour-codes its tubs. Colour is wayfinding here, not decoration: a reader
 * learns that blue is soup without reading the label.
 *
 * `fg` is the ink printed on that field, chosen for contrast (all >= 5:1).
 */
export interface Lid {
  field: string;
  fg: string;
}

const LIDS: Record<string, Lid> = {
  "osnovni-yastia": { field: "#c8231b", fg: "#ffffff" },
  supi: { field: "#1f3fbf", fg: "#ffffff" },
  salati: { field: "#1b6e37", fg: "#ffffff" },
  testeni: { field: "#c89b63", fg: "#14161a" },
  postni: { field: "#55631a", fg: "#ffffff" },
  deserti: { field: "#f5c400", fg: "#14161a" },
  konservi: { field: "#e8590c", fg: "#14161a" },
};

/** A recipe without a category still gets a field: plain ink. */
const FALLBACK: Lid = { field: "#14161a", fg: "#ffffff" };

export function lidFor(slug: string | null | undefined): Lid {
  return (slug && LIDS[slug]) || FALLBACK;
}

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

/** CSS custom properties for a lid field, for `style={lidStyle(...)}`. */
export function lidStyle(slug: string | null | undefined): React.CSSProperties {
  const lid = lidFor(slug);
  return { "--lid": lid.field, "--lid-fg": lid.fg } as React.CSSProperties;
}
