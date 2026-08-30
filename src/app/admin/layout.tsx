import Link from "next/link";
import { logout } from "@/app/admin/actions";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <div className="mb-8 flex items-center justify-between border-b border-black/10 pb-4 dark:border-white/10">
        <Link href="/admin" className="font-semibold">
          Администрация
        </Link>
        <form action={logout}>
          <button type="submit" className="text-sm text-zinc-500 hover:underline">
            Изход
          </button>
        </form>
      </div>
      {children}
    </div>
  );
}
