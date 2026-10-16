"use client";

import { useActionState, useEffect, useRef } from "react";
import { KeyRound, Lock, ShieldCheck } from "lucide-react";
import { changePassword, type PasswordActionState } from "@/app/admin/actions";
import { primaryButton } from "@/components/admin/styles";

const initialState: PasswordActionState = { status: "idle" };

const MESSAGES: Record<PasswordActionState["status"], string> = {
  idle: "",
  success: "Паролата е сменена успешно.",
  mismatch: "Двете нови пароли не съвпадат.",
  weak: "Новата парола трябва да е поне 12 знака.",
  wrong_current: "Текущата парола е грешна.",
  error: "Паролата не беше сменена. Опитайте отново.",
};

const fieldClass = "field h-12 pl-10 pr-3 text-body";

function Field({
  name,
  label,
  autoComplete,
}: {
  name: string;
  label: string;
  autoComplete: string;
}) {
  return (
    <label className="flex flex-col gap-1.5 font-semibold">
      {label}
      <div className="relative">
        <Lock
          size={15}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          type="password"
          name={name}
          required
          minLength={name === "current_password" ? undefined : 12}
          autoComplete={autoComplete}
          className={fieldClass}
        />
      </div>
    </label>
  );
}

export function ChangePasswordForm() {
  const [state, formAction, pending] = useActionState(changePassword, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state]);

  const isError = state.status !== "idle" && state.status !== "success";

  return (
    <div className="max-w-md rounded-2xl border border-border-subtle bg-surface p-6 sm:p-8">
      <h2 className="flex items-center gap-2 text-heading font-bold">
        <KeyRound size={18} className="text-accent" />
        Смяна на паролата
      </h2>
      <p className="mt-2 text-muted-foreground">
        Изберете парола, която знаете само вие — поне 12 знака.
      </p>

      <form ref={formRef} action={formAction} className="mt-5 flex flex-col gap-4">
        <Field name="current_password" label="Текуща парола" autoComplete="current-password" />
        <Field name="new_password" label="Нова парола" autoComplete="new-password" />
        <Field name="confirm_password" label="Повтори новата парола" autoComplete="new-password" />

        <button
          type="submit"
          disabled={pending}
          className={`mt-1 ${primaryButton}`}
        >
          <ShieldCheck size={15} />
          {pending ? "Записване…" : "Смени паролата"}
        </button>
      </form>

      <p
        aria-live="polite"
        className={`mt-3 min-h-6 font-medium ${isError ? "text-destructive-strong" : "text-secondary"}`}
      >
        {state.message ?? MESSAGES[state.status]}
      </p>
    </div>
  );
}
