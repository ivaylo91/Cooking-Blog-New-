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
 * On a phone, ingredients and method are the pack's front and back: this bar
 * keeps both one tap away while cooking, and shows which side you are on.
 */
export function RecipeTabs() {
  const active = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <nav
      aria-label="Части на рецептата"
      className="sticky top-[67px] z-30 -mx-4 grid grid-cols-2 border-b-[3px] border-rule bg-background sm:-mx-6 md:hidden print:hidden"
    >
      {sides.map((side) => {
        const isActive = active === side.id;
        return (
          <a
            key={side.id}
            href={`#${side.id}`}
            aria-current={isActive ? "location" : undefined}
            className={`flex h-12 items-center justify-center font-heading text-xl font-extrabold uppercase tracking-wide transition-colors first:border-r-[3px] first:border-rule ${
              isActive ? "bg-foreground text-background" : ""
            }`}
          >
            {side.label}
          </a>
        );
      })}
    </nav>
  );
}
