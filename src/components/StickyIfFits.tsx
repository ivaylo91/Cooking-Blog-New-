"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Sticks below the header only while the whole panel fits in the viewport.
 * A long ingredient list would otherwise be clipped at the bottom of a laptop
 * screen with no sign that more rows exist; when it doesn't fit, it simply
 * scrolls with the page.
 */
export function StickyIfFits({
  children,
  className = "",
  stickyClassName,
  offset = 112,
}: {
  children: React.ReactNode;
  className?: string;
  /** Classes applied only while the panel fits (e.g. "md:sticky md:top-24"). */
  stickyClassName: string;
  /** Space above the panel when stuck, in px, so it clears the header. */
  offset?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [fits, setFits] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    function measure() {
      if (el) setFits(el.offsetHeight + offset + 16 <= window.innerHeight);
    }
    // The observer reports once on observe(), which covers the first measure.
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [offset]);

  return (
    <div ref={ref} className={`${className} ${fits ? stickyClassName : ""}`}>
      {children}
    </div>
  );
}
