import { CookingBackground } from "@/components/CookingBackground";

// Literal class names, so Tailwind can see and generate every one.
const TONES = {
  peach: "bg-peach",
  sage: "bg-sage",
  butter: "bg-butter",
  rose: "bg-rose",
  wheat: "bg-wheat",
  olive: "bg-olive",
  sky: "bg-sky",
  // The one dark band, so it brings its own light text.
  garden: "bg-garden text-on-garden",
  plain: "",
} as const;

export type Tone = keyof typeof TONES;

/**
 * A full-width coloured section, the magazine spread's colour block. The
 * content inside keeps the site's 72rem column.
 */
export function Band({
  tone,
  children,
  className = "",
  innerClassName = "",
  pattern = false,
  as: Tag = "section",
  ...rest
}: {
  tone: Tone;
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  /** Decorative cooking artwork. Put text inside solid panels when enabled. */
  pattern?: boolean;
  as?: "section" | "div" | "header";
} & React.HTMLAttributes<HTMLElement>) {
  return (
    <Tag className={`${TONES[tone]} ${pattern ? "relative isolate overflow-hidden" : ""} ${className}`} {...rest}>
      {pattern && <CookingBackground className="absolute inset-0 text-link" opacity={0.32} scale={0.85} colorful />}
      <div className={`${pattern ? "relative" : ""} mx-auto max-w-6xl px-4 sm:px-6 ${innerClassName}`}>{children}</div>
    </Tag>
  );
}
