// Class strings shared by server and client admin components. Kept out of any
// "use client" module: a server component importing a value from one gets a
// client reference, not the string.

/** Every delete control in the admin. */
export const dangerButton =
  "inline-flex h-10 items-center rounded-full px-3 text-small font-semibold text-destructive-strong transition-colors hover:bg-destructive-soft disabled:opacity-50";

/** Primary action: the tomato pill. */
export const primaryButton =
  "inline-flex h-11 items-center justify-center gap-2 rounded-full bg-accent px-5 font-semibold text-accent-foreground transition-[background-color,transform] hover:bg-accent-strong active:scale-[0.97] disabled:opacity-60";

/** Secondary action: an outlined pill. */
export const secondaryButton =
  "inline-flex h-11 items-center justify-center gap-2 rounded-full border border-field-border px-5 font-medium transition-colors hover:bg-surface-muted";

/** A page title with an optional count beside it. */
export const pageTitle = "text-heading font-bold";
