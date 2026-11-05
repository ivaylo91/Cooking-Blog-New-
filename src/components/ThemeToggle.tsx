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

// Blocked site data makes localStorage throw; this sits in the root layout,
// so an unguarded read would take every page down with it.
function readStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    // Fall through to the system theme.
  }
  return getSystemTheme();
}

export function ThemeToggle() {
  const storedTheme = useSyncExternalStore(noopSubscribe, readStoredTheme, () => "light" as Theme);
  const [override, setOverride] = useState<Theme | null>(null);
  const theme = override ?? storedTheme;

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Not remembered for next time, but the switch still applies now.
    }
    document.documentElement.setAttribute("data-theme", next);
    setOverride(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="flex size-11 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-surface-muted"
      aria-label={theme === "dark" ? "Светла тема" : "Тъмна тема"}
    >
      {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
