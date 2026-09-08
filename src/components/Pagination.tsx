import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Compact page list: always the first and last page, plus a window around the
 * current one, with gaps collapsed to an ellipsis.
 */
function pageItems(page: number, pageCount: number): Array<number | "gap"> {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }

  const items: Array<number | "gap"> = [1];
  const from = Math.max(2, page - 1);
  const to = Math.min(pageCount - 1, page + 1);

  if (from > 2) items.push("gap");
  for (let i = from; i <= to; i++) items.push(i);
  if (to < pageCount - 1) items.push("gap");

  items.push(pageCount);
  return items;
}

const base =
  "flex h-9 min-w-9 items-center justify-center rounded-full border px-3 text-sm font-medium transition";
const on = "border-accent bg-accent text-accent-foreground";
const off = "border-border-subtle hover:border-accent hover:text-accent";
const disabled = "border-border-subtle opacity-40";

export function Pagination({
  page,
  pageCount,
  hrefFor,
}: {
  page: number;
  pageCount: number;
  /** Builds a URL for a page while preserving the active filters. */
  hrefFor: (page: number) => string;
}) {
  if (pageCount <= 1) return null;

  return (
    <nav aria-label="Страници" className="mt-10 flex flex-wrap items-center justify-center gap-2">
      {page > 1 ? (
        <Link href={hrefFor(page - 1)} rel="prev" aria-label="Предишна страница" className={`${base} ${off}`}>
          <ChevronLeft size={16} />
        </Link>
      ) : (
        <span aria-hidden="true" className={`${base} ${disabled}`}>
          <ChevronLeft size={16} />
        </span>
      )}

      {pageItems(page, pageCount).map((item, index) =>
        item === "gap" ? (
          <span key={`gap-${index}`} className="px-1 text-muted-foreground">
            …
          </span>
        ) : (
          <Link
            key={item}
            href={hrefFor(item)}
            aria-label={`Страница ${item}`}
            aria-current={item === page ? "page" : undefined}
            className={`${base} ${item === page ? on : off}`}
          >
            {item}
          </Link>
        )
      )}

      {page < pageCount ? (
        <Link href={hrefFor(page + 1)} rel="next" aria-label="Следваща страница" className={`${base} ${off}`}>
          <ChevronRight size={16} />
        </Link>
      ) : (
        <span aria-hidden="true" className={`${base} ${disabled}`}>
          <ChevronRight size={16} />
        </span>
      )}
    </nav>
  );
}
