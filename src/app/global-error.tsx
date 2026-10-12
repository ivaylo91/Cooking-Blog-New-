"use client";

import "./globals.css";

/**
 * Last resort: this replaces the root layout, so it has to bring its own
 * <html> and <body>. Only reached when the layout itself fails, which the
 * per-segment error.tsx cannot catch. The layout's web font is not loaded
 * here, so the text falls back to the system sans in the token stack.
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
      <body className="flex min-h-screen items-center justify-center bg-background p-6 font-sans text-foreground">
        <div className="max-w-md">
          <h1 className="text-display font-bold leading-tight">Нещо се обърка</h1>
          <p className="mt-2 text-muted-foreground">
            Сайтът не можа да се зареди. Опитайте отново след малко.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-6 h-14 rounded-full bg-accent px-7 text-body font-semibold text-accent-foreground transition-colors hover:bg-accent-strong"
          >
            Опитай отново
          </button>
          {error.digest && (
            <p className="mt-6 font-mono text-small text-muted-foreground">Код: {error.digest}</p>
          )}
        </div>
      </body>
    </html>
  );
}
