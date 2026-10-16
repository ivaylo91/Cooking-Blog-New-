"use client";

import { useTransition } from "react";
import { deleteRecipe, togglePublish } from "@/app/admin/actions";
import { dangerButton } from "@/components/admin/styles";

/** Shows the state; a tap flips it. The label says what the tap will do. */
export function PublishToggle({ id, published }: { id: string; published: boolean }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => startTransition(() => togglePublish(id, !published))}
      aria-pressed={published}
      title={published ? "Скрий от сайта" : "Публикувай"}
      className={`inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-small font-semibold transition-colors disabled:opacity-60 ${
        published
          ? "bg-secondary-soft text-secondary hover:brightness-95"
          : "bg-surface-muted text-muted-foreground hover:bg-border-subtle"
      }`}
    >
      <span
        aria-hidden="true"
        className={`size-2 rounded-full ${published ? "bg-secondary" : "bg-muted-foreground"}`}
      />
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
      className={dangerButton}
    >
      Изтрий
    </button>
  );
}
