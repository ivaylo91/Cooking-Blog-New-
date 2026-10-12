// Literal class names, so Tailwind can see and generate every one.
const TONES = {
  peach: "bg-peach",
  sage: "bg-sage",
  butter: "bg-butter",
  rose: "bg-rose",
  wheat: "bg-wheat",
  olive: "bg-olive",
  sky: "bg-sky",
  plain: "",
} as const;

/**
 * A full-width coloured section, the magazine spread's colour block. The
 * content inside keeps the site's 72rem column.
 */
export function Band({
  tone,
  children,
  className = "",
  innerClassName = "",
  as: Tag = "section",
  ...rest
}: {
  tone: keyof typeof TONES;
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  as?: "section" | "div" | "header";
} & React.HTMLAttributes<HTMLElement>) {
  return (
    <Tag className={`${TONES[tone]} ${className}`} {...rest}>
      <div className={`mx-auto max-w-6xl px-4 sm:px-6 ${innerClassName}`}>{children}</div>
    </Tag>
  );
}
