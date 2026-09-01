import { getRecipes } from "@/lib/recipes";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const recipes = await getRecipes({ limit: 30 });

  const items = recipes
    .map((recipe) => {
      const url = `${siteUrl}/recepti/${recipe.slug}`;
      return `
    <item>
      <title>${escapeXml(recipe.title)}</title>
      <link>${url}</link>
      <guid>${url}</guid>
      <description>${escapeXml(recipe.description)}</description>
      ${recipe.category ? `<category>${escapeXml(recipe.category.name)}</category>` : ""}
      <pubDate>${new Date(recipe.created_at).toUTCString()}</pubDate>
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Кулинарният блог на Иво</title>
    <link>${siteUrl}</link>
    <description>Домашни рецепти за хобиисти и ентусиасти на готвенето.</description>
    <language>bg</language>
    <atom:link xmlns:atom="http://www.w3.org/2005/Atom" href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
