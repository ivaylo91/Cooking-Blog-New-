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
          ? "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400"
          : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
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
      className="text-xs text-red-600 hover:underline dark:text-red-400"
    >
      Изтрий
    </button>
  );
}
