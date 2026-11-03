import Link from "next/link";
import { ArrowRight } from "lucide-react";

/** A section title with an optional "see all" link on the right. */
export function SectionHead({
  title,
  id,
  action,
  as: Tag = "h2",
}: {
  title: string;
  id?: string;
  action?: { href: string; label: string };
  as?: "h1" | "h2";
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-x-6 gap-y-1">
      <Tag id={id} className="font-heading text-section font-bold">
        {title}
      </Tag>
      {action && (
        <Link
          href={action.href}
          className="flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-field-border bg-surface px-4 py-2 text-small font-semibold text-link transition-colors hover:bg-accent-soft"
        >
          {action.label}
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}
