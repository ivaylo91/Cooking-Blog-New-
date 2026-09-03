"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { addComment, type CommentActionState } from "@/app/recepti/actions";

const initialState: CommentActionState = { status: "idle" };

export function CommentForm({ recipeId, slug }: { recipeId: string; slug: string }) {
  const [renderedAt] = useState(() => Date.now());
  const [state, formAction, isPending] = useActionState(
    addComment.bind(null, recipeId, slug),
    initialState
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="form_rendered_at" value={renderedAt} />
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />
      <input
        type="text"
        name="author_name"
        required
        maxLength={60}
        placeholder="Вашето име"
        className="rounded-md border border-border-subtle bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
      />
      <textarea
        name="text"
        required
        maxLength={1000}
        rows={3}
        placeholder="Напишете коментар..."
        className="rounded-md border border-border-subtle bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
      />
      <button
        type="submit"
        disabled={isPending}
        className="self-start rounded-full bg-accent px-5 py-2 text-sm font-semibold text-accent-foreground transition hover:bg-accent-strong disabled:opacity-60"
      >
        {isPending ? "Публикуване..." : "Публикувай коментар"}
      </button>

      {state.status === "success" && (
        <p className="text-sm font-medium text-secondary">
          Коментарът е публикуван успешно!
        </p>
      )}
      {state.status === "rate_limited" && (
        <p className="text-sm text-destructive">
          Твърде много коментари за кратко време. Опитайте отново след малко.
        </p>
      )}
      {state.status === "error" && (
        <p className="text-sm text-destructive">Нещо се обърка. Опитайте отново.</p>
      )}
    </form>
  );
}
