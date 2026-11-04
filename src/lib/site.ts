/**
 * The production origin. Canonicals, the sitemap, robots.txt, RSS, Open Graph
 * and JSON-LD all build absolute URLs from it, so a wrong value would point
 * search engines at the wrong site. NEXT_PUBLIC_SITE_URL wins; on Vercel the
 * project's production domain is the fallback; localhost only for local work.
 */
function resolveSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_ENV === "production") {
    throw new Error("Set NEXT_PUBLIC_SITE_URL: production URLs would otherwise point at localhost.");
  }
  return "http://localhost:3000";
}

export const siteUrl = resolveSiteUrl();

export const siteName = "Кулинарният блог на Иво";

export const siteDescription =
  "Домашни български рецепти, сготвени в кухнята на Иво: основни ястия, супи, салати, тестени и десерти с точни мерки и ясни стъпки.";

/**
 * Open Graph fields every page shares. A page that sets `openGraph` replaces
 * the layout's whole block rather than merging into it, so each page spreads
 * this in alongside its own title, description and url.
 */
export const sharedOpenGraph = { siteName, locale: "bg_BG" } as const;
