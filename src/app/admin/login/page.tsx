import { Lock } from "lucide-react";
import { login } from "@/app/admin/actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="mx-auto flex max-w-sm flex-col px-6 py-20">
      <div className="rounded-2xl border border-border-subtle bg-surface p-8 shadow-lg sm:p-10">
        <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground">
          <Lock size={22} strokeWidth={2} />
        </span>
        <h1 className="text-center font-heading text-2xl font-semibold">
          Вход в администрацията
        </h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Влезте, за да управлявате рецептите
        </p>

        {error && (
          <p className="mt-5 rounded-lg border border-destructive-border bg-destructive-soft px-3 py-2 text-sm text-destructive-strong">
            {error}
          </p>
        )}

        <form action={login} className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Имейл
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              className="rounded-lg border-2 border-border-subtle bg-background px-3 py-2.5 font-normal outline-none transition focus:border-accent focus:ring-2 focus:ring-accent-soft"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Парола
            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
              className="rounded-lg border-2 border-border-subtle bg-background px-3 py-2.5 font-normal outline-none transition focus:border-accent focus:ring-2 focus:ring-accent-soft"
            />
          </label>
          <button
            type="submit"
            className="mt-2 rounded-full bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground transition hover:bg-accent-strong"
          >
            Вход
          </button>
        </form>
      </div>
    </div>
  );
}
