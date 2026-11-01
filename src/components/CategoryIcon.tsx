import {
  CakeSlice,
  Cherry,
  CookingPot,
  Croissant,
  Leaf,
  Salad,
  Soup,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  "osnovni-yastia": CookingPot,
  supi: Soup,
  salati: Salad,
  testeni: Croissant,
  postni: Leaf,
  deserti: CakeSlice,
  konservi: Cherry,
};

/** One drawn sign per shelf, so a category is recognised before it is read. */
export function CategoryIcon({ slug, size = 18 }: { slug: string; size?: number }) {
  const Icon = ICONS[slug] ?? UtensilsCrossed;
  return <Icon size={size} aria-hidden="true" className="shrink-0" />;
}
