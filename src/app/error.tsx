"use client";

import Link from "next/link";
import { RotateCw, UtensilsCrossed } from "lucide-react";

/**
 * Every page on the site reads from Supabase, so a failed query would
 * otherwise drop the visitor on Next's unstyled default error screen with no
 * way back. `reset()` re-renders the segment, which is enough to recover from
 * a transient outage without a full reload.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-2xl px-6 py-20 text-center">
      <div className="rounded-2xl border border-border-subtle bg-surface p-10">
        <span className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent-soft text-accent-strong">
          <UtensilsCrossed size={28} strokeWidth={1.75} />
        </span>
        <h1 className="font-heading text-3xl font-bold">Нещо изгоря в кухнята</h1>
        <p className="mt-2 text-muted-foreground">
          Страницата не можа да се зареди. Опитайте отново след малко.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition hover:bg-accent-strong"
          >
            <RotateCw size={15} />
            Опитай отново
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-border-subtle px-6 py-3 text-sm font-semibold transition hover:border-accent hover:text-accent"
          >
            Към началото
          </Link>
        </div>

        {/* The digest is the only handle on the server-side log for this error. */}
        {error.digest && (
          <p className="mt-6 font-mono text-xs text-muted-foreground">
            Код: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
