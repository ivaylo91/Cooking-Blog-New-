"use client";

import { useActionState, useEffect, useRef } from "react";
import { subscribe, type SubscribeActionState } from "@/app/recepti/actions";

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
        <h2 id="subscribe-head" className="text-heading font-bold">
          Нови рецепти в пощата
        </h2>
        <p className="mt-2 max-w-md text-muted-foreground">
          Оставете имейла си и ще ви пиша, когато добавя нова рецепта. Без спам, без
          реклами. Можете да се отпишете по всяко време.
        </p>
      </div>

      <div>
        <form ref={formRef} action={formAction} className="flex flex-col gap-2 sm:flex-row">
          {/* Honeypot: hidden from people, tempting to bots. */}
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="hidden"
          />
          <label className="sr-only" htmlFor="subscribe-email">
            Имейл адрес
          </label>
          <input
            id="subscribe-email"
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="вашият@имейл.бг"
            className="field field-pill h-14 flex-1 px-5 text-body"
          />
          <button
            type="submit"
            disabled={pending}
            className="h-14 rounded-full bg-accent px-7 text-body font-semibold text-accent-foreground transition-[background-color,transform] hover:bg-accent-strong active:scale-[0.97] disabled:opacity-60"
          >
            {pending ? "Записване…" : "Запиши ме"}
          </button>
        </form>

        <p
          aria-live="polite"
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
