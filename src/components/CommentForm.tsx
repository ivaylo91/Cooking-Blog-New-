"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { addComment, type CommentActionState } from "@/app/recepti/actions";

const initialState: CommentActionState = { status: "idle" };

const field = "field px-4 text-body";
const MAX = 1000;

export function CommentForm({ recipeId }: { recipeId: string }) {
  const [renderedAt] = useState(() => Date.now());
  const [state, formAction, isPending] = useActionState(
    addComment.bind(null, recipeId),
    initialState
  );
  const formRef = useRef<HTMLFormElement>(null);
  const [length, setLength] = useState(0);
  // A successful post empties the form, so the counter starts over with it.
  const [countedFor, setCountedFor] = useState(state);
  if (countedFor !== state) {
    setCountedFor(state);
    if (state.status === "success") setLength(0);
  }

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
          className="font-semibold"
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
          className="font-semibold"
        >
          Коментар
        </label>
        <textarea
          id="comment-text"
          name="text"
          required
          maxLength={MAX}
          rows={4}
          onChange={(e) => setLength(e.target.value.length)}
          aria-describedby="comment-count"
          className={`${field} min-h-32 resize-y py-3`}
        />
        <span
          id="comment-count"
          className={`self-end text-small tabular-nums ${
            length > MAX * 0.9 ? "text-destructive-strong" : "text-muted-foreground"
          }`}
        >
          {length} / {MAX}
        </span>
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="inline-flex h-14 items-center gap-2 self-start rounded-full bg-foreground px-7 text-body font-semibold text-background transition-[opacity,transform] hover:opacity-85 active:scale-[0.97] disabled:opacity-60"
      >
        {isPending && <Loader2 size={18} className="motion-safe:animate-spin" />}
        {isPending ? "Публикуване…" : "Публикувай"}
      </button>

      <p aria-live="polite" className="min-h-6 font-medium">
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
