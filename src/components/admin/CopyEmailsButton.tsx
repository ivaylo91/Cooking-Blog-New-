"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

/**
 * The sandbox blocks script-driven downloads, so the list is copied to the
 * clipboard rather than offered as a CSV file.
 */
export function CopyEmailsButton({ emails }: { emails: string[] }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(emails.join(", "));
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-2 rounded-full border border-border-subtle px-4 py-2 text-sm font-medium transition hover:border-accent hover:text-accent"
    >
      {copied ? <Check size={15} className="text-secondary" /> : <Copy size={15} />}
      {copied ? "Копирано" : "Копирай имейлите"}
    </button>
  );
}
