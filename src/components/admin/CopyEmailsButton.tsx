"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { secondaryButton } from "@/components/admin/styles";

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
      className={secondaryButton}
    >
      {copied ? <Check size={15} className="text-secondary" /> : <Copy size={15} />}
      {copied ? "Копирано" : "Копирай имейлите"}
    </button>
  );
}
