"use client";

import { useSyncExternalStore } from "react";

type Side = "sastavki" | "prigotvyane";

function subscribe(callback: () => void) {
  window.addEventListener("scroll", callback, { passive: true });
  window.addEventListener("resize", callback);
  return () => {
    window.removeEventListener("scroll", callback);
    window.removeEventListener("resize", callback);
  };
}

// Below the sticky header and this bar, with room to spare.
const THRESHOLD = 160;

function getSnapshot(): Side {
  const method = document.getElementById("prigotvyane");
  return method && method.getBoundingClientRect().top <= THRESHOLD ? "prigotvyane" : "sastavki";
}

const getServerSnapshot = (): Side => "sastavki";

const sides: Array<{ id: Side; label: string }> = [
  { id: "sastavki", label: "Съставки" },
  { id: "prigotvyane", label: "Приготвяне" },
];

/**
 * On a phone, ingredients and method stay one tap apart while cooking, and the
 * segmented control shows which part you are reading.
 */
export function RecipeTabs() {
  const active = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <nav
      aria-label="Части на рецептата"
      // Sits directly under the 64px header and its 1px border.
      className="sticky top-[65px] z-30 -mx-4 bg-background/90 px-4 py-2 backdrop-blur-md sm:-mx-6 sm:px-6 md:hidden print:hidden"
    >
      <div className="relative grid grid-cols-2 rounded-full bg-surface-muted p-1">
        {/* The indicator slides rather than jumping, so the switch reads as one control. */}
        <span
          aria-hidden="true"
          className="absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-background shadow-sm transition-transform duration-300 ease-out"
          style={{ transform: active === "prigotvyane" ? "translateX(100%)" : "none" }}
        />
        {sides.map((side) => {
          const isActive = active === side.id;
          return (
            <a
              key={side.id}
              href={`#${side.id}`}
              aria-current={isActive ? "location" : undefined}
              className={`relative flex h-11 items-center justify-center rounded-full font-semibold transition-colors ${
                isActive ? "" : "text-muted-foreground"
              }`}
            >
              {side.label}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
