"use client";

import { useTransition } from "react";
import { deleteRecipe, togglePublish } from "@/app/admin/actions";

export function PublishToggle({ id, published }: { id: string; published: boolean }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => startTransition(() => togglePublish(id, !published))}
      className={`rounded-full px-3 py-1 text-xs font-medium ${
        published
          ? "bg-secondary-soft text-secondary"
          : "bg-surface-muted text-muted-foreground"
      }`}
    >
      {published ? "Публикувана" : "Чернова"}
    </button>
  );
}

export function DeleteRecipeButton({ id, title }: { id: string; title: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (confirm(`Изтриване на „${title}“? Това действие е необратимо.`)) {
          startTransition(() => deleteRecipe(id));
        }
      }}
      className="text-xs text-destructive hover:underline"
    >
      Изтрий
    </button>
  );
}
