"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      aria-label="Разпечатай"
      className="flex size-11 items-center justify-center border-2 border-rule transition-colors hover:bg-surface-muted print:hidden"
    >
      <Printer size={20} strokeWidth={2.25} />
    </button>
  );
}
