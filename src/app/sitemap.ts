import type { MetadataRoute } from "next";
import { getRecipes } from "@/lib/recipes";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const recipes = await getRecipes();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date() },
    { url: `${siteUrl}/recepti`, lastModified: new Date() },
    { url: `${siteUrl}/za-ivo`, lastModified: new Date() },
  ];

  const recipeRoutes: MetadataRoute.Sitemap = recipes.map((recipe) => ({
    url: `${siteUrl}/recepti/${recipe.slug}`,
    lastModified: recipe.updated_at,
  }));

  return [...staticRoutes, ...recipeRoutes];
}
