"use client";

import Link from "next/link";
import { ArrowRight, X } from "lucide-react";
import { forgetCooking, useLastCooked } from "@/lib/lastCooked";

/**
 * Back to the dish someone left half-made. Rendered only in the browser that
 * was cooking it; the prerendered page has nothing here.
 */
export function ResumeCooking() {
  const last = useLastCooked();
  if (!last) return null;

  return (
    <div className="animate-rise mt-6 flex items-center gap-2 rounded-2xl bg-surface p-2 pl-5 shadow-card">
      <Link
        href={`/recepti/${last.slug}${last.step != null ? "#prigotvyane" : ""}`}
        className="flex min-h-11 flex-1 items-center gap-2 font-semibold text-link"
      >
        <span className="min-w-0">
          Продължете: {last.title}
          {last.step != null && (
            <span className="font-medium"> · стъпка {last.step + 1}</span>
          )}
        </span>
        <ArrowRight size={18} className="shrink-0" />
      </Link>
      <button
        type="button"
        onClick={forgetCooking}
        aria-label="Скрий"
        className="flex size-11 shrink-0 items-center justify-center rounded-full text-link transition-colors hover:bg-background/60"
      >
        <X size={18} />
      </button>
    </div>
  );
}
