"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, X } from "lucide-react";

export function WelcomeToast() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shouldShow = searchParams.get("welcome") === "1";
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!shouldShow) return;
    router.replace("/admin");
    const timer = setTimeout(() => setDismissed(true), 4000);
    return () => clearTimeout(timer);
  }, [shouldShow, router]);

  if (!shouldShow || dismissed) return null;

  return (
    <div className="fixed right-4 top-20 z-50 flex items-center gap-2 rounded-full border border-border-subtle bg-surface px-4 py-2.5 shadow-lg">
      <CheckCircle2 size={18} className="text-secondary" />
      <span className="text-sm font-medium">Влязохте успешно</span>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="ml-1 text-muted-foreground hover:text-foreground"
        aria-label="Затвори"
      >
        <X size={14} />
      </button>
    </div>
  );
}
