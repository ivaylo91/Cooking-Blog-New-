"use client";

import { useActionState, useState, useSyncExternalStore } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
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
      // Private mode or blocked storage — the vote still counts server-side.
    }
  }

  return (
    <div className="print:hidden">
      <form action={formAction} className="flex flex-wrap items-center gap-2">
        <div
          className="flex items-center gap-0.5"
          onMouseLeave={() => setHovered(null)}
          role="group"
          aria-label="Оцени рецептата"
        >
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
              className="rounded p-0.5 transition disabled:opacity-50"
            >
              <FontAwesomeIcon
                icon={faStar}
                className={`h-4 w-4 text-accent ${star <= filledTo ? "" : "opacity-25"}`}
              />
            </button>
          ))}
        </div>

        <span className="text-xs text-muted-foreground">
          {count > 0 ? `${average.toFixed(1)} / 5 (${count})` : "Още няма оценки"}
        </span>
      </form>

      <p aria-live="polite" className="mt-1 min-h-4 text-xs text-secondary">
        {state.status === "success" && "Благодарим за оценката!"}
        {state.status === "error" && (
          <span className="text-destructive-strong">Оценката не беше записана.</span>
        )}
      </p>
    </div>
  );
}
