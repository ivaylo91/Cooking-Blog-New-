import type { MetadataRoute } from "next";
import { cacheLife } from "next/cache";
import { getImageUrl } from "@/lib/images";
import { getRecipes, getStockedCategories } from "@/lib/recipes";

// Cached so the sitemap is prerendered rather than rebuilt on every crawl.
// The static routes take their `lastModified` from the newest recipe instead of
// the current clock, which would be an unstable value during prerendering.
async function buildSitemap(): Promise<MetadataRoute.Sitemap> {
  "use cache";
  cacheLife("hours");

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const [recipes, categories] = await Promise.all([getRecipes(), getStockedCategories()]);
  const lastModified = recipes[0]?.updated_at ?? recipes[0]?.created_at;

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified },
    { url: `${siteUrl}/recepti`, lastModified },
    { url: `${siteUrl}/za-ivo`, lastModified },
  ];

  // Each stocked shelf is an indexable page with its own canonical URL.
  const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${siteUrl}/recepti?category=${category.slug}`,
    lastModified,
  }));

  const recipeRoutes: MetadataRoute.Sitemap = recipes.map((recipe) => ({
    url: `${siteUrl}/recepti/${recipe.slug}`,
    lastModified: recipe.updated_at,
    // The dish photo, so the recipe can also be found through image search.
    images: getImageUrl(recipe.image_path) ? [getImageUrl(recipe.image_path)!] : undefined,
  }));

  return [...staticRoutes, ...categoryRoutes, ...recipeRoutes];
}

export default function sitemap(): Promise<MetadataRoute.Sitemap> {
  return buildSitemap();
}
