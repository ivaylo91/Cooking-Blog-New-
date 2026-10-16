"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";

/**
 * The site search field. "/" focuses it from anywhere (unless you're already
 * typing), and a clear button appears once there is text.
 */
export function SearchField({
  id,
  className = "",
  defaultValue = "",
  size = "default",
  shortcut = false,
  autoFocus = false,
}: {
  id: string;
  className?: string;
  defaultValue?: string;
  size?: "default" | "large";
  /** Only one field on a page should own the "/" shortcut. */
  shortcut?: boolean;
  /** For a field revealed on demand, such as the phone header's search. */
  autoFocus?: boolean;
}) {
  const [value, setValue] = useState(defaultValue);
  const inputRef = useRef<HTMLInputElement>(null);
  const large = size === "large";

  useEffect(() => {
    if (!shortcut) return;
    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const typing =
        target?.isContentEditable ||
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.tagName === "SELECT";
      if (event.key === "/" && !typing && !event.metaKey && !event.ctrlKey) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [shortcut]);

  return (
    <form action="/tarsene" role="search" className={`relative ${className}`}>
      <label htmlFor={id} className="sr-only">
        Търсене на рецепта
      </label>
      <Search
        size={large ? 20 : 18}
        className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-muted-foreground ${
          large ? "left-5" : "left-4"
        }`}
      />
      <input
        ref={inputRef}
        id={id}
        type="search"
        name="q"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={large ? "Например: супа, баница, без месо" : "Търсете рецепта"}
        autoComplete="off"
        autoFocus={autoFocus}
        enterKeyHint="search"
        className={`field field-pill [&::-webkit-search-cancel-button]:hidden ${
          large ? "h-14 pl-13 pr-40 text-body" : "h-11 pl-11 pr-11"
        }`}
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            setValue("");
            inputRef.current?.focus();
          }}
          aria-label="Изчисти търсенето"
          className={`animate-pop absolute top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-surface-muted hover:text-foreground ${
            large ? "right-[6.5rem]" : "right-0"
          }`}
        >
          <X size={17} />
        </button>
      )}
      {large ? (
        <button
          type="submit"
          className="absolute right-1.5 top-1/2 h-11 -translate-y-1/2 rounded-full bg-accent px-6 font-semibold text-accent-foreground transition-[background-color,transform] hover:bg-accent-strong active:scale-[0.97]"
        >
          Търси
        </button>
      ) : (
        shortcut &&
        !value && (
          <kbd
            aria-hidden="true"
            className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md border border-border-subtle px-1.5 text-small text-muted-foreground lg:block"
          >
            /
          </kbd>
        )
      )}
    </form>
  );
}
