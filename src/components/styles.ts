// Class strings shared by server and client components. Kept out of any
// "use client" module: a server component importing a value from one gets a
// client reference, not the string.

/** The 56px tomato pill's look, for a label inside a link that owns the hover. */
export const primaryPill =
  "inline-flex h-14 items-center justify-center gap-2 rounded-full bg-accent px-7 text-body font-semibold text-accent-foreground";

/** The public site's primary action: the tomato pill as a button or link. */
export const primaryAction = `${primaryPill} transition-[background-color,transform] hover:bg-accent-strong active:scale-[0.97] disabled:opacity-60`;
