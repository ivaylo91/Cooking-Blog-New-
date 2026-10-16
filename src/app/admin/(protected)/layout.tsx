import Link from "next/link";
import { Suspense } from "react";
import { ExternalLink, LogOut } from "lucide-react";
import { logout } from "@/app/admin/actions";
import { AdminNav } from "@/components/admin/AdminNav";
import { WelcomeToast } from "@/components/admin/WelcomeToast";

const quietLink =
  "flex h-11 items-center gap-2 rounded-full px-3 font-medium text-muted-foreground transition-colors hover:bg-surface-muted hover:text-foreground";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <Suspense fallback={null}>
        <WelcomeToast />
      </Suspense>
      <div className="mb-8 flex flex-col gap-3 border-b border-border-subtle pb-4 md:flex-row md:items-center md:justify-between">
        <AdminNav />
        <div className="flex items-center gap-1">
          <Link href="/" className={quietLink}>
            <ExternalLink size={17} aria-hidden="true" />
            Към сайта
          </Link>
          <form action={logout}>
            <button type="submit" className={quietLink}>
              <LogOut size={17} aria-hidden="true" />
              Изход
            </button>
          </form>
        </div>
      </div>
      {children}
    </div>
  );
}
