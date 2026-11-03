"use client";

import { useActionState, useEffect, useRef } from "react";
import { Loader2, Mail } from "lucide-react";
import { subscribe, type SubscribeActionState } from "@/app/recepti/actions";
import { primaryButton } from "@/components/styles";
import { submitInTransition } from "@/lib/forms";

const initialState: SubscribeActionState = { status: "idle" };

const MESSAGES: Record<SubscribeActionState["status"], string> = {
  idle: "",
  success: "Готово! Ще получавате новите рецепти.",
  duplicate: "Този имейл вече е записан.",
  invalid: "Моля, въведете валиден имейл адрес.",
  error: "Нещо се обърка. Опитайте отново.",
};

export function SubscribeForm() {
  const [state, formAction, pending] = useActionState(subscribe, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state]);

  const isError = state.status === "invalid" || state.status === "error";

  return (
    <section
      aria-labelledby="subscribe-head"
      className="grid gap-6 md:grid-cols-[1fr_1.1fr] md:items-center"
    >
      <div>
        <h2 id="subscribe-head" className="text-section font-bold">
          Нови рецепти в пощата
        </h2>
        <p className="mt-2 max-w-md text-muted-foreground">
          Оставете имейла си и ще ви пиша, когато добавя нова рецепта. Без спам, без
          реклами. Можете да се отпишете по всяко време.
        </p>
      </div>

      <div>
        <form
          ref={formRef}
          action={formAction}
          // React clears a form after its action; handled here, a mistyped
          // address stays in the field so it can be corrected. Without
          // JavaScript the plain action above still works.
          onSubmit={submitInTransition(formAction)}
        >
          {/* Honeypot: hidden from people, tempting to bots. */}
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="hidden"
          />
          <label className="mb-1.5 block font-semibold" htmlFor="subscribe-email">
            Имейл адрес
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              id="subscribe-email"
              type="email"
              name="email"
              required
              maxLength={254}
              placeholder="ime@example.com"
              autoComplete="email"
              autoCapitalize="none"
              spellCheck={false}
              enterKeyHint="send"
              aria-invalid={isError}
              aria-describedby="subscribe-status"
              className="field field-pill h-14 min-w-0 px-5 text-body sm:flex-1"
            />
            <button
              type="submit"
              disabled={pending}
              className={`shadow-card ${primaryButton}`}
            >
              {pending ? (
                <Loader2 size={20} aria-hidden="true" className="motion-safe:animate-spin" />
              ) : (
                <Mail size={20} aria-hidden="true" />
              )}
              {pending ? "Записване…" : "Запиши ме"}
            </button>
          </div>
        </form>

        <p
          id="subscribe-status"
          role="status"
          className={`mt-2 min-h-6 px-2 font-medium ${isError ? "text-destructive-strong" : "text-secondary"}`}
        >
          {state.status === "success" ? (
            <span className="animate-pop inline-block">{MESSAGES.success}</span>
          ) : (
            MESSAGES[state.status]
          )}
        </p>
      </div>
    </section>
  );
}
