"use client";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { analyticsOptedOut } from "@/lib/analyticsOptOut";

/**
 * Vercel's visit and speed statistics. They set no cookies; a visitor who
 * switches them off on /poveritelnost sends nothing more, because each event
 * is dropped before it leaves the browser.
 */
export function SiteAnalytics() {
  return (
    <>
      <Analytics beforeSend={(event) => (analyticsOptedOut() ? null : event)} />
      <SpeedInsights beforeSend={(event) => (analyticsOptedOut() ? null : event)} />
    </>
  );
}
