"use client";

import Link from "next/link";
import { RotateCw } from "lucide-react";

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
    <div className="bg-peach">
      <div className="animate-rise mx-auto max-w-6xl px-4 pt-12 sm:px-6 sm:pt-20 pb-16 sm:pb-24">
      <h1 className="max-w-3xl text-display font-bold leading-[1.05]">
        Нещо изгоря в кухнята
      </h1>
      <p className="mt-4 max-w-xl text-body text-muted-foreground">
        Страницата не можа да се зареди. Опитайте отново след малко.
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-14 items-center gap-2 rounded-full bg-accent px-7 text-body font-semibold text-accent-foreground transition-[background-color,transform] hover:bg-accent-strong active:scale-[0.97]"
        >
          <RotateCw size={20} />
          Опитай отново
        </button>
        <Link
          href="/"
          className="inline-flex h-14 items-center rounded-full bg-surface px-7 text-body font-semibold shadow-card transition-[transform] active:scale-[0.97]"
        >
          Към началото
        </Link>
      </div>

      {/* The digest is the only handle on the server-side log for this error. */}
      {error.digest && (
        <p className="mt-8 font-mono text-small text-muted-foreground">Код: {error.digest}</p>
      )}
    </div>
    </div>
  );
}
