"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { addComment, type CommentActionState } from "@/app/recepti/actions";

const initialState: CommentActionState = { status: "idle" };

const field =
  "w-full border-2 border-rule bg-surface px-3 text-lg outline-none transition-colors placeholder:text-muted-foreground focus:border-accent";

export function CommentForm({ recipeId }: { recipeId: string }) {
  const [renderedAt] = useState(() => Date.now());
  const [state, formAction, isPending] = useActionState(
    addComment.bind(null, recipeId),
    initialState
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="form_rendered_at" value={renderedAt} />
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="comment-name"
          className="font-heading text-base font-bold uppercase tracking-[0.12em]"
        >
          Име
        </label>
        <input
          id="comment-name"
          type="text"
          name="author_name"
          required
          maxLength={60}
          autoComplete="name"
          className={`${field} h-12`}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="comment-text"
          className="font-heading text-base font-bold uppercase tracking-[0.12em]"
        >
          Коментар
        </label>
        <textarea
          id="comment-text"
          name="text"
          required
          maxLength={1000}
          rows={4}
          className={`${field} py-2`}
        />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="h-14 self-start bg-foreground px-6 font-heading text-xl font-extrabold uppercase tracking-wide text-background transition-opacity hover:opacity-85 disabled:opacity-60"
      >
        {isPending ? "Публикуване…" : "Публикувай"}
      </button>

      <p aria-live="polite" className="min-h-6 text-base font-semibold">
        {state.status === "success" && (
          <span className="text-secondary">Коментарът е публикуван.</span>
        )}
        {state.status === "rate_limited" && (
          <span className="text-destructive-strong">
            Твърде много коментари за кратко време. Опитайте отново след малко.
          </span>
        )}
        {state.status === "error" && (
          <span className="text-destructive-strong">
            Коментарът не беше публикуван. Проверете името и текста и опитайте отново.
          </span>
        )}
      </p>
    </form>
  );
}
