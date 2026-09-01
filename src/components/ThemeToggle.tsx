"use client";

import { useState, useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

function noopSubscribe() {
  return () => {};
}

function getSystemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function readStoredTheme(): Theme {
  const stored = localStorage.getItem("theme");
  return stored === "light" || stored === "dark" ? stored : getSystemTheme();
}

export function ThemeToggle() {
  const storedTheme = useSyncExternalStore(noopSubscribe, readStoredTheme, () => "light" as Theme);
  const [override, setOverride] = useState<Theme | null>(null);
  const theme = override ?? storedTheme;

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", next);
    document.documentElement.setAttribute("data-theme", next);
    setOverride(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-border-subtle transition hover:border-accent hover:text-accent"
      aria-label="Превключи темата"
    >
      {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
