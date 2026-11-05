import type { Metadata } from "next";
import { Lora, Onest } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { Footer } from "@/components/Footer";
import { SiteAnalytics } from "@/components/SiteAnalytics";
import { sharedOpenGraph, siteDescription, siteName, siteUrl } from "@/lib/site";

// Onest is a contemporary grotesk drawn for Cyrillic first, so Bulgarian text
// sets as naturally as Latin. It carries everything a cook reads and taps.
const onest = Onest({
  variable: "--font-onest",
  subsets: ["latin", "cyrillic"],
});

// Lora, a warm book serif with full Cyrillic, sets the headlines only, so the
// pages read like a food magazine while the working text stays a clean sans.
// Every Lora heading is bold, so only the 700 weight is shipped.
const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin", "cyrillic"],
  weight: "700",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  // No canonical here: each indexable page sets its own. An inherited "/"
  // would tell search engines that every page without one is the home page.
  alternates: {
    types: { "application/rss+xml": "/rss.xml" },
  },
  // Lets Google show the large food photos in Discover and image-rich results.
  robots: { "max-image-preview": "large" },
  // Defaults for pages that set no openGraph of their own. No url here: an
  // inherited one would make every such page share as the home page.
  openGraph: {
    ...sharedOpenGraph,
    type: "website",
    title: siteName,
    description: siteDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="bg"
      className={`${onest.variable} ${lora.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          // Runs before paint to avoid a flash of the wrong theme.
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t);}}catch(e){}`,
          }}
        />
      </head>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-accent focus:px-5 focus:py-3 focus:text-body focus:font-semibold focus:text-accent-foreground"
        >
          Прескочи към съдържанието
        </a>
        <SiteHeader />
        <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
        <Footer />
        {/* No cookies; disclosed on /poveritelnost with an opt-out there, the
            route chosen in COOKIES-PRIVACY-RESEARCH.md (option a). */}
        <SiteAnalytics />
      </body>
    </html>
  );
}
