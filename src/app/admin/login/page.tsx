import { Lock } from "lucide-react";
import { LoginForm } from "@/components/admin/LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="mx-auto flex max-w-sm flex-col px-4 py-12 sm:py-20">
      <div className="rounded-3xl border border-border-subtle bg-surface p-6 shadow-card sm:p-10">
        <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground">
          <Lock size={22} strokeWidth={2} />
        </span>
        <h1 className="text-center text-heading font-bold">
          Вход в администрацията
        </h1>
        <p className="mt-2 text-center text-muted-foreground">
          Влезте, за да управлявате рецептите
        </p>

        {error && (
          <p role="alert" className="mt-5 rounded-xl border border-destructive-border bg-destructive-soft px-3 py-2 text-small font-medium text-destructive-strong">
            {error}
          </p>
        )}

        <LoginForm />
      </div>
    </div>
  );
}
