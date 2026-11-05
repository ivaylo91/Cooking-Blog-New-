"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Loader2, Send } from "lucide-react";
import { addComment, type CommentActionState } from "@/app/recepti/actions";
import { primaryAction } from "@/components/styles";
import { submitInTransition } from "@/lib/forms";

const initialState: CommentActionState = { status: "idle" };

const field = "field px-4 text-body";
const MAX = 1000;

export function CommentForm({ recipeId }: { recipeId: string }) {
  // When the form appeared, for the anti-bot time trap. Stamped after load,
  // not during render: reading the clock while rendering makes Cache
  // Components defer the whole recipe page to the browser. Without
  // JavaScript the field stays empty and the server skips the check.
  const renderedAtRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (renderedAtRef.current) renderedAtRef.current.value = String(Date.now());
  }, []);
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
      // reset() empties the stamp too; the next comment starts its clock now.
      if (renderedAtRef.current) renderedAtRef.current.value = String(Date.now());
    }
  }, [state]);

  // Only an empty name or text is the fields' fault; a failed save or a rate
  // limit is not.
  const isInvalid = state.status === "invalid";

  return (
    <form
      ref={formRef}
      action={formAction}
      // The server checks the fields and answers in our own words, instead
      // of the browser's generic bubble.
      noValidate
      // React clears a form after its action; handled here, a comment that
      // fails or hits the rate limit stays in the box instead of being lost.
      // Without JavaScript the plain action above still works.
      onSubmit={submitInTransition(formAction)}
      className="flex flex-col gap-4"
    >
      <input ref={renderedAtRef} type="hidden" name="form_rendered_at" defaultValue="" />
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
          placeholder="Например: Мария"
          autoComplete="name"
          autoCapitalize="words"
          enterKeyHint="next"
          aria-invalid={isInvalid}
          aria-describedby="comment-name-hint comment-status"
          className={`${field} h-12`}
        />
        <p id="comment-name-hint" className="text-small text-muted-foreground">
          Ще се вижда до коментара. Може и само малко име или псевдоним.
        </p>
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
          placeholder="Например: стана чудесно, сложих малко повече чесън."
          rows={4}
          onChange={(e) => setLength(e.target.value.length)}
          aria-invalid={isInvalid}
          aria-describedby="comment-count comment-status"
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
        className={`self-start shadow-card ${primaryAction}`}
      >
        {isPending ? (
          <Loader2 size={20} aria-hidden="true" className="motion-safe:animate-spin" />
        ) : (
          <Send size={20} aria-hidden="true" />
        )}
        {isPending ? "Публикуване…" : "Публикувай"}
      </button>

      <p className="-mt-1 text-small text-muted-foreground">
        За защита от спам пазя хеширан отпечатък на IP адреса ви, не самия адрес.{" "}
        <Link href="/poveritelnost" className="font-semibold text-link underline">
          Поверителност
        </Link>
      </p>

      <p id="comment-status" role="status" className="min-h-6 font-medium">
        {state.status === "success" && (
          <span className="text-secondary">Коментарът е публикуван.</span>
        )}
        {state.status === "rate_limited" && (
          <span className="text-destructive-strong">
            Твърде много коментари за кратко време. Опитайте отново след малко.
          </span>
        )}
        {state.status === "invalid" && (
          <span className="text-destructive-strong">
            Коментарът не беше публикуван. Попълнете името и текста и опитайте отново.
          </span>
        )}
        {state.status === "error" && (
          <span className="text-destructive-strong">
            Коментарът не беше публикуван. Опитайте отново след малко.
          </span>
        )}
      </p>
    </form>
  );
}
