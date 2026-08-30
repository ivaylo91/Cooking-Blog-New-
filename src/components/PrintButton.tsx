"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="ml-auto flex items-center gap-1.5 rounded-full border border-border-subtle px-3 py-1.5 text-xs font-medium hover:border-accent hover:text-accent print:hidden"
    >
      <Printer size={13} /> Разпечатай
    </button>
  );
}
