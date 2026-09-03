"use client";

import { useState } from "react";
import { CheckCircle2, Lock, Mail } from "lucide-react";
import { login } from "@/app/admin/actions";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const fieldClass =
  "w-full rounded-lg border-2 border-border-subtle bg-background py-2.5 pl-10 pr-10 font-normal outline-none transition focus:border-accent focus:ring-2 focus:ring-accent-soft";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const emailValid = EMAIL_PATTERN.test(email);
  const passwordValid = password.length > 0;

  return (
    <form action={login} className="mt-6 flex flex-col gap-4">
      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Имейл
        <div className="relative">
          <Mail
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={fieldClass}
          />
          {emailValid && (
            <CheckCircle2
              size={16}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-secondary"
            />
          )}
        </div>
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Парола
        <div className="relative">
          <Lock
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="password"
            name="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={fieldClass}
          />
          {passwordValid && (
            <CheckCircle2
              size={16}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-secondary"
            />
          )}
        </div>
      </label>

      <button
        type="submit"
        className="mt-2 rounded-full bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground transition hover:bg-accent-strong"
      >
        Вход
      </button>
    </form>
  );
}
