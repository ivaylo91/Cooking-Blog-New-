"use client";

import { useState, useSyncExternalStore } from "react";
import { Heart } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

function noopSubscribe() {
  return () => {};
}

function readLiked(recipeId: string): boolean {
  try {
    return localStorage.getItem(`liked:${recipeId}`) === "1";
  } catch {
    return false;
  }
}

/**
 * The heart fills at once and the count goes up before the server answers;
 * if the save fails, both go back and a short message says so. The name
 * stays "Харесай" so `aria-pressed` alone tells a screen reader the state.
 */
export function LikeButton({
  recipeId,
  initialLikes,
}: {
  recipeId: string;
  initialLikes: number;
}) {
  const [likes, setLikes] = useState(initialLikes);
  const [justLiked, setJustLiked] = useState(false);
  const [failed, setFailed] = useState(false);

  const storedLiked = useSyncExternalStore(noopSubscribe, () => readLiked(recipeId), () => false);
  const liked = justLiked || storedLiked;

  async function handleLike() {
    if (liked) return;
    setFailed(false);
    setJustLiked(true);
    setLikes((count) => count + 1);

    const supabase = createClient();
    const { data, error } = await supabase.rpc("increment_recipe_likes", {
      p_recipe_id: recipeId,
    });
    if (error) {
      setJustLiked(false);
      setLikes((count) => count - 1);
      setFailed(true);
      return;
    }
    if (typeof data === "number") setLikes(data);
    try {
      localStorage.setItem(`liked:${recipeId}`, "1");
    } catch {
      // Counted on the server; this device just won't remember the heart.
    }
  }

  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={handleLike}
        disabled={liked}
        aria-pressed={liked}
        aria-label={`Харесай, ${likes}`}
        className={`flex h-11 min-w-11 items-center justify-center gap-1.5 rounded-full px-3.5 font-semibold tabular-nums transition-[background-color,color,transform] active:scale-95 ${
          liked ? "bg-accent-soft text-link" : "bg-surface-muted hover:bg-border-subtle"
        }`}
      >
        <Heart size={20} aria-hidden="true" className={liked ? "animate-pop fill-current" : ""} />
        {likes > 0 && likes}
      </button>
      <span role="status" className="text-small font-medium text-destructive-strong">
        {failed && "Харесването не се записа. Опитайте пак."}
      </span>
    </span>
  );
}
