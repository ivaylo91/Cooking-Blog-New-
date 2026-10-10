"use client";

import { useActionState, useState, useSyncExternalStore } from "react";
import { Star } from "lucide-react";
import { rateRecipe, type RatingActionState } from "@/app/recepti/actions";

const initialState: RatingActionState = { status: "idle", value: null };

function storageKey(recipeId: string) {
  return `rated:${recipeId}`;
}

/**
 * Which star the visitor picked is a per-browser convenience, so it lives in
 * localStorage; the authoritative average always comes from the server.
 * useSyncExternalStore keeps that read out of an effect.
 */
function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

export function RatingStars({
  recipeId,
  slug,
  average,
  count,
}: {
  recipeId: string;
  slug: string;
  average: number;
  count: number;
}) {
  const [state, formAction, pending] = useActionState(
    rateRecipe.bind(null, recipeId, slug),
    initialState
  );

  const stored = useSyncExternalStore(
    subscribe,
    () => {
      try {
        return localStorage.getItem(storageKey(recipeId));
      } catch {
        return null;
      }
    },
    () => null
  );

  const [picked, setPicked] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  const myRating = picked ?? state.value ?? (stored ? Number(stored) : null);
  // Once the visitor has voted, show their own rating; otherwise the average.
  const filledTo = hovered ?? myRating ?? Math.round(average);

  function remember(star: number) {
    setPicked(star);
    try {
      localStorage.setItem(storageKey(recipeId), String(star));
    } catch {
      // Private mode or blocked storage: the vote still counts server-side.
    }
  }

  return (
    <div className="print:hidden">
      <form action={formAction} className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <div
          className="flex items-center"
          onMouseLeave={() => setHovered(null)}
          role="group"
          aria-label="Оцени рецептата"
        >
          {/* Each star is a full 44px target: a mis-tap here is a real vote. */}
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="submit"
              name="value"
              value={star}
              disabled={pending}
              onClick={() => remember(star)}
              onMouseEnter={() => setHovered(star)}
              onFocus={() => setHovered(star)}
              onBlur={() => setHovered(null)}
              aria-label={`${star} от 5`}
              aria-pressed={myRating === star}
              className="flex size-11 items-center justify-center disabled:opacity-50"
            >
              <Star
                size={26}
                strokeWidth={2.25}
                className={star <= filledTo ? "fill-current" : "opacity-45"}
              />
            </button>
          ))}
        </div>

        <span className="font-heading text-lg font-bold uppercase tracking-wide tabular-nums">
          {count > 0 ? `${average.toFixed(1)} от 5 · ${count}` : "Сготвихте ли я? Оценете я."}
        </span>
      </form>

      <p aria-live="polite" className="min-h-6 text-base font-semibold text-secondary">
        {state.status === "success" && "Благодарим за оценката!"}
        {state.status === "error" && (
          <span className="text-destructive-strong">Оценката не беше записана.</span>
        )}
      </p>
    </div>
  );
}
