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
      <Tag id={id} className="text-heading font-bold">
        {title}
      </Tag>
      {action && (
        <Link
          href={action.href}
          className="flex h-11 shrink-0 items-center gap-1.5 font-semibold text-link hover:underline"
        >
          {action.label}
          <ArrowRight size={18} />
        </Link>
      )}
    </div>
  );
}
