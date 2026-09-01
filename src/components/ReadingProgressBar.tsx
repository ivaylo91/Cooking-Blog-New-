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

function getSnapshot() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  if (scrollable <= 0) return 0;
  return Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100));
}

function getServerSnapshot() {
  return 0;
}

export function ReadingProgressBar() {
  const progress = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <div className="fixed inset-x-0 top-0 z-50 h-1 print:hidden" aria-hidden="true">
      <div
        className="h-full bg-accent transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
