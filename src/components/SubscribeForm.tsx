"use client";

import { useActionState, useEffect, useRef } from "react";
import { Mail, Send } from "lucide-react";
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
    <section className="rounded-2xl border border-border-subtle bg-surface p-6 sm:p-8">
      <h2 className="flex items-center gap-2 font-heading text-xl font-semibold">
        <Mail size={18} className="text-accent" />
        Нови рецепти в пощата
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Оставете имейла си и ще ви пиша, когато добавя нова рецепта. Без спам, без
        реклами — можете да се отпишете по всяко време.
      </p>

      <form ref={formRef} action={formAction} className="mt-4 flex flex-col gap-3 sm:flex-row">
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
          className="w-full flex-1 rounded-full border-2 border-border-subtle bg-background px-4 py-2.5 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent-soft"
        />
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition hover:bg-accent-strong disabled:opacity-60"
        >
          <Send size={15} />
          {pending ? "Записване…" : "Запиши ме"}
        </button>
      </form>

      <p
        aria-live="polite"
        className={`mt-2 min-h-5 text-sm ${isError ? "text-destructive-strong" : "text-secondary"}`}
      >
        {MESSAGES[state.status]}
      </p>
    </section>
  );
}
