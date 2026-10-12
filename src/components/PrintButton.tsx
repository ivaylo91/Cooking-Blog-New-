"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      aria-label="Разпечатай"
      className="flex size-11 items-center justify-center rounded-full bg-surface-muted transition-colors hover:bg-border-subtle print:hidden"
    >
      <Printer size={20} />
    </button>
  );
}
