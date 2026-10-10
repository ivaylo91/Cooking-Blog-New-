"use client";

import { useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  window.addEventListener("scroll", callback, { passive: true });
  window.addEventListener("resize", callback);
  return () => {
    window.removeEventListener("scroll", callback);
    window.removeEventListener("resize", callback);
  };
}

/**
 * Progress through the recipe itself, not the whole page: measured against
 * one element, so the bar reads full at the last step rather than counting
 * the related recipes, newsletter and comments below it.
 */
export function ReadingProgressBar({ targetId }: { targetId: string }) {
  const progress = useSyncExternalStore(
    subscribe,
    () => {
      const el = document.getElementById(targetId);
      if (!el) return 0;
      const top = el.getBoundingClientRect().top + window.scrollY;
      const scrollable = el.offsetHeight - window.innerHeight * 0.6;
      if (scrollable <= 0) return 1;
      const ratio = (window.scrollY - top + window.innerHeight * 0.4) / scrollable;
      // Rounded so tiny scroll deltas don't re-render the bar.
      return Math.round(Math.min(1, Math.max(0, ratio)) * 200) / 200;
    },
    () => 0
  );

  return (
    <div className="fixed inset-x-0 top-0 z-50 h-1 print:hidden" aria-hidden="true">
      {/* scaleX, not width: the bar moves on the compositor, not through layout. */}
      <div
        className="h-full origin-left bg-accent"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}
