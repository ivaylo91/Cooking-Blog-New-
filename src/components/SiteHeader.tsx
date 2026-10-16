import { Header } from "@/components/Header";
import { inCooksOrder } from "@/lib/categories";
import { getStockedCategories } from "@/lib/recipes";

/**
 * The header with the phone menu's category shortcuts read from the shelves
 * that actually hold recipes. The read is cached, so it stays in the
 * prerendered shell.
 */
export async function SiteHeader() {
  const categories = await getStockedCategories();
  return <Header categories={inCooksOrder(categories)} />;
}
