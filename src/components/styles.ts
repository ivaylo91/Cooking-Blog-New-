// Class strings shared by server and client components. Kept out of any
// "use client" module: a server component importing a value from one gets a
// client reference, not the string.

/** The primary action: the 56px tomato pill. */
export const primaryButton =
  "inline-flex h-14 items-center justify-center gap-2 rounded-full bg-accent px-7 text-body font-semibold text-accent-foreground transition-[background-color,transform] hover:bg-accent-strong active:scale-[0.97] disabled:opacity-60";
