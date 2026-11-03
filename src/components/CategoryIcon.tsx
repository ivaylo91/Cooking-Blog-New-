import { UtensilsCrossed } from "lucide-react";
import { CATEGORY_ICONS } from "@/lib/categories";

/** One drawn sign per shelf, so a category is recognised before it is read. */
export function CategoryIcon({ slug, size = 18 }: { slug: string; size?: number }) {
  const Icon = CATEGORY_ICONS[slug] ?? UtensilsCrossed;
  return <Icon size={size} aria-hidden="true" className="shrink-0" />;
}
