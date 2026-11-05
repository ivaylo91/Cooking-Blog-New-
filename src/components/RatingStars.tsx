"use client";

import { useActionState, useEffect, useState, useSyncExternalStore } from "react";
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

  // The pick shows at once; it is remembered on this device only once the
  // server has saved it, and a failed vote puts the stars back.
  const [seenState, setSeenState] = useState(state);
  if (seenState !== state) {
    setSeenState(state);
    if (state.status === "error") setPicked(null);
  }

  useEffect(() => {
    if (state.status !== "success" || state.value == null) return;
    try {
      localStorage.setItem(storageKey(recipeId), String(state.value));
    } catch {
      // Private mode or blocked storage: the vote still counts server-side.
    }
  }, [state, recipeId]);

  function remember(star: number) {
    setPicked(star);
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
              className="flex size-11 items-center justify-center transition-transform disabled:opacity-50 motion-safe:hover:scale-110 motion-safe:active:scale-95"
            >
              {/* Keyed by the vote, so the pop plays once when it lands
                  rather than every time the pointer passes over a star. */}
              <Star
                key={picked != null && star <= picked ? `voted-${picked}` : "idle"}
                size={26}
                className={`${
                  star <= filledTo ? "fill-accent text-accent" : "text-muted-foreground"
                } ${picked != null && star <= picked ? "animate-pop" : ""}`}
              />
            </button>
          ))}
        </div>

        <span className="font-medium text-muted-foreground tabular-nums">
          {count > 0 ? `${average.toFixed(1)} от 5 · ${count} оценки` : "Още няма оценки"}
        </span>
      </form>

      <p aria-live="polite" className="min-h-6 font-medium text-secondary">
        {state.status === "success" && "Благодарим за оценката!"}
        {state.status === "error" && (
          <span className="text-destructive-strong">Оценката не беше записана. Опитайте отново.</span>
        )}
      </p>
    </div>
  );
}
