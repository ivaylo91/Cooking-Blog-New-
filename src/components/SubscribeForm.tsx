"use client";

import { useActionState, useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { subscribe, type SubscribeActionState } from "@/app/recepti/actions";

const initialState: SubscribeActionState = { status: "idle" };

const MESSAGES: Record<SubscribeActionState["status"], string> = {
  idle: "",
  success: "Готово! Ще получавате новите рецепти.",
  duplicate: "Този имейл вече е записан.",
  invalid: "Моля, въведете валиден имейл адрес.",
  error: "Нещо се обърка. Опитайте отново.",
};

/** The coupon on the side of the pack: a boxed panel with a dashed cut line. */
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
      className="border-2 border-dashed border-rule p-1.5"
    >
      <div className="grid gap-6 border-2 border-rule bg-surface p-5 sm:p-7 md:grid-cols-[1fr_1.1fr] md:items-end">
        <div>
          <h2
            id="subscribe-head"
            className="font-heading text-4xl font-extrabold uppercase leading-[0.9] tracking-wide"
          >
            Нови рецепти в пощата
          </h2>
          <p className="mt-3 max-w-md text-base text-muted-foreground">
            Оставете имейла си и ще ви пиша, когато добавя нова рецепта. Без спам, без
            реклами — можете да се отпишете по всяко време.
          </p>
        </div>

        <div>
          <form ref={formRef} action={formAction} className="flex flex-col gap-3 sm:flex-row">
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
              className="h-14 w-full flex-1 border-2 border-rule bg-background px-4 text-lg outline-none transition-colors placeholder:text-muted-foreground focus:border-accent"
            />
            <button
              type="submit"
              disabled={pending}
              className="inline-flex h-14 items-center justify-center gap-2 bg-accent px-6 font-heading text-xl font-extrabold uppercase tracking-wide text-accent-foreground transition-colors hover:bg-accent-strong disabled:opacity-60"
            >
              {pending ? "Записване…" : "Запиши ме"}
              {!pending && <ArrowRight size={20} strokeWidth={2.5} />}
            </button>
          </form>

          <p
            aria-live="polite"
            className={`mt-2 min-h-6 text-base font-semibold ${isError ? "text-destructive-strong" : "text-secondary"}`}
          >
            {MESSAGES[state.status]}
          </p>
        </div>
      </div>
    </section>
  );
}
