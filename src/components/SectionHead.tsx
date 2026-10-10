import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * A printed section head: condensed caps over a heavy rule, the way a label
 * boxes off "Съставки" or "Начин на приготвяне".
 */
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
    <div className="mb-6 flex flex-wrap items-end justify-between gap-x-6 gap-y-2 border-b-[3px] border-rule pb-2">
      <Tag
        id={id}
        className="font-heading text-[2.5rem] font-extrabold uppercase leading-[0.9] tracking-wide sm:text-5xl"
      >
        {title}
      </Tag>
      {action && (
        <Link
          href={action.href}
          className="flex h-11 shrink-0 items-center gap-1.5 font-heading text-lg font-bold uppercase tracking-wide hover:underline"
        >
          {action.label}
          <ArrowRight size={18} strokeWidth={2.5} />
        </Link>
      )}
    </div>
  );
}
