import type { MetadataRoute } from "next";
import { cacheLife } from "next/cache";
import { getRecipes } from "@/lib/recipes";

// Cached so the sitemap is prerendered rather than rebuilt on every crawl.
// The static routes take their `lastModified` from the newest recipe instead of
// the current clock, which would be an unstable value during prerendering.
async function buildSitemap(): Promise<MetadataRoute.Sitemap> {
  "use cache";
  cacheLife("hours");

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const recipes = await getRecipes();
  const lastModified = recipes[0]?.updated_at ?? recipes[0]?.created_at;

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified },
    { url: `${siteUrl}/recepti`, lastModified },
    { url: `${siteUrl}/za-ivo`, lastModified },
  ];

  const recipeRoutes: MetadataRoute.Sitemap = recipes.map((recipe) => ({
    url: `${siteUrl}/recepti/${recipe.slug}`,
    lastModified: recipe.updated_at,
  }));

  return [...staticRoutes, ...recipeRoutes];
}

export default function sitemap(): Promise<MetadataRoute.Sitemap> {
  return buildSitemap();
}
