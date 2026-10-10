"use client";

import { useState, useSyncExternalStore } from "react";
import { Heart } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

function noopSubscribe() {
  return () => {};
}

export function LikeButton({
  recipeId,
  initialLikes,
}: {
  recipeId: string;
  initialLikes: number;
}) {
  const [likes, setLikes] = useState(initialLikes);
  const [justLiked, setJustLiked] = useState(false);
  const [pending, setPending] = useState(false);

  const storedLiked = useSyncExternalStore(
    noopSubscribe,
    () => localStorage.getItem(`liked:${recipeId}`) === "1",
    () => false
  );
  const liked = justLiked || storedLiked;

  async function handleLike() {
    if (liked || pending) return;
    setPending(true);
    const supabase = createClient();
    const { data, error } = await supabase.rpc("increment_recipe_likes", {
      p_recipe_id: recipeId,
    });
    if (!error) {
      setLikes(typeof data === "number" ? data : (l) => l + 1);
      localStorage.setItem(`liked:${recipeId}`, "1");
      setJustLiked(true);
    } else {
      console.error("increment_recipe_likes failed:", error);
    }
    setPending(false);
  }

  return (
    <button
      type="button"
      onClick={handleLike}
      disabled={liked || pending}
      aria-pressed={liked}
      aria-label={liked ? `Харесано, ${likes}` : `Харесай, ${likes}`}
      className={`flex h-11 min-w-11 items-center justify-center gap-1.5 border-2 border-rule px-3 font-heading text-xl font-extrabold tabular-nums transition-colors ${
        liked ? "bg-foreground text-background" : "hover:bg-surface-muted"
      }`}
    >
      <Heart size={20} strokeWidth={2.5} className={liked ? "fill-current" : ""} />
      {likes > 0 && likes}
    </button>
  );
}
