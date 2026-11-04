import type { MetadataRoute } from "next";
import { cacheLife } from "next/cache";
import { getImageUrl } from "@/lib/images";
import { getRecipes, getStockedCategories } from "@/lib/recipes";
import { siteUrl } from "@/lib/site";

// Cached so the sitemap is prerendered rather than rebuilt on every crawl.
// The static routes take their `lastModified` from the newest recipe instead of
// the current clock, which would be an unstable value during prerendering.
async function buildSitemap(): Promise<MetadataRoute.Sitemap> {
  "use cache";
  cacheLife("hours");

  const [recipes, categories] = await Promise.all([getRecipes(), getStockedCategories()]);
  const lastModified = recipes[0]?.updated_at ?? recipes[0]?.created_at;

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified },
    { url: `${siteUrl}/recepti`, lastModified },
    { url: `${siteUrl}/za-ivo`, lastModified },
    { url: `${siteUrl}/poveritelnost` },
  ];

  // Each stocked shelf is an indexable page with its own canonical URL, last
  // changed when its newest recipe was (recipes come newest first).
  const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => {
    const newest = recipes.find((recipe) => recipe.category?.slug === category.slug);
    return {
      url: `${siteUrl}/recepti?category=${category.slug}`,
      lastModified: newest?.updated_at ?? lastModified,
    };
  });

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
