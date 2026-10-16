"use client";

import { dangerButton } from "@/components/admin/styles";

/**
 * A submit button for a destructive server-action form that asks first, so a
 * stray tap cannot delete a comment or a subscriber.
 */
export function ConfirmSubmitButton({
  message,
  children,
}: {
  message: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="submit"
      onClick={(event) => {
        if (!confirm(message)) event.preventDefault();
      }}
      className={dangerButton}
    >
      {children}
    </button>
  );
}
