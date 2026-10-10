"use client";

import "./globals.css";

/**
 * Last resort: this replaces the root layout, so it has to bring its own
 * <html> and <body>. Only reached when the layout itself fails, which the
 * per-segment error.tsx cannot catch.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="bg">
      <body className="flex min-h-screen items-center justify-center bg-background p-6 text-foreground">
        <div className="max-w-md border-2 border-rule bg-surface p-8">
          <h1 className="font-heading text-5xl font-black uppercase leading-[0.9]">Нещо се обърка</h1>
          <p className="mt-2 text-muted-foreground">
            Сайтът не можа да се зареди. Опитайте отново след малко.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-6 h-14 bg-accent px-6 font-heading text-xl font-extrabold uppercase tracking-wide text-accent-foreground transition-colors hover:bg-accent-strong"
          >
            Опитай отново
          </button>
          {error.digest && (
            <p className="mt-6 font-mono text-xs text-muted-foreground">Код: {error.digest}</p>
          )}
        </div>
      </body>
    </html>
  );
}
