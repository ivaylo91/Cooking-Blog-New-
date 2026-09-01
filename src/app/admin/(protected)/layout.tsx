import Link from "next/link";
import { ChefHat, Home, LogOut, MessageSquare } from "lucide-react";
import { logout } from "@/app/admin/actions";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <div className="mb-8 flex items-center justify-between border-b border-border-subtle pb-4">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-foreground">
            <ChefHat size={16} strokeWidth={2.25} />
          </span>
          <span className="font-heading text-lg font-semibold">Администрация</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/"
            title="Към сайта"
            aria-label="Към сайта"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border-subtle transition hover:border-accent hover:text-accent"
          >
            <Home size={16} />
          </Link>
          <Link
            href="/admin/comments"
            title="Коментари"
            aria-label="Коментари"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border-subtle transition hover:border-accent hover:text-accent"
          >
            <MessageSquare size={16} />
          </Link>
          <form action={logout}>
            <button
              type="submit"
              title="Изход"
              aria-label="Изход"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border-subtle transition hover:border-accent hover:text-accent"
            >
              <LogOut size={16} />
            </button>
          </form>
        </div>
      </div>
      {children}
    </div>
  );
}
