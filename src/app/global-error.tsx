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
        <div className="max-w-md rounded-2xl border border-border-subtle bg-surface p-10 text-center">
          <h1 className="font-heading text-2xl font-bold">Нещо се обърка</h1>
          <p className="mt-2 text-muted-foreground">
            Сайтът не можа да се зареди. Опитайте отново след малко.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-6 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition hover:bg-accent-strong"
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
