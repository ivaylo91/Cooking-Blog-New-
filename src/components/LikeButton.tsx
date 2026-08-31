"use client";

import { useState, useSyncExternalStore } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
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
      className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
        liked
          ? "border-accent bg-accent-soft text-accent-strong"
          : "border-border-subtle hover:border-accent hover:text-accent"
      }`}
    >
      <FontAwesomeIcon icon={faHeart} className={liked ? "text-accent" : ""} />
      {likes}
    </button>
  );
}
