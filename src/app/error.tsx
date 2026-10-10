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
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <div className="border-2 border-rule border-t-[6px] border-t-stamp">
        <div className="p-5 sm:p-8">
          <h1 className="font-heading text-[clamp(2.75rem,11vw,6rem)] font-black uppercase leading-[0.88] [text-wrap:balance]">
            Нещо изгоря в кухнята
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted-foreground">
            Страницата не можа да се зареди. Опитайте отново след малко.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={reset}
              className="inline-flex h-14 items-center gap-2 bg-accent px-6 font-heading text-xl font-extrabold uppercase tracking-wide text-accent-foreground transition-colors hover:bg-accent-strong"
            >
              <RotateCw size={20} strokeWidth={2.5} />
              Опитай отново
            </button>
            <Link
              href="/"
              className="inline-flex h-14 items-center border-2 border-rule px-6 font-heading text-xl font-extrabold uppercase tracking-wide transition-colors hover:bg-surface-muted"
            >
              Към началото
            </Link>
          </div>

          {/* The digest is the only handle on the server-side log for this error. */}
          {error.digest && (
            <p className="mt-8 font-mono text-sm text-muted-foreground">Код: {error.digest}</p>
          )}
        </div>
      </div>
    </div>
  );
}
