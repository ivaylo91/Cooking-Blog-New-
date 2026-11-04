"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { secondaryButton } from "@/components/admin/styles";

/**
 * The sandbox blocks script-driven downloads, so the list is copied to the
 * clipboard rather than offered as a CSV file. Pasted into "To" or "Cc",
 * every subscriber would see every other address, so the button and its
 * confirmation both say to use Bcc.
 */
export function CopyEmailsButton({ emails }: { emails: string[] }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(emails.join(", "));
      setCopied(true);
      setTimeout(() => setCopied(false), 6000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <button type="button" onClick={copy} className={secondaryButton}>
        {copied ? <Check size={15} className="text-secondary" /> : <Copy size={15} />}
        {copied ? "Копирано" : "Копирай имейлите за Bcc"}
      </button>
      <p aria-live="polite" className="text-small text-muted-foreground">
        {copied
          ? "Поставете ги само в полето „Скрито копие“ (Bcc), никога в „До“ или „Копие“."
          : "Само за полето „Скрито копие“ (Bcc), за да не виждат абонатите адресите си."}
      </p>
    </div>
  );
}
