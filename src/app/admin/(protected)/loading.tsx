import { Skeleton } from "@/components/Skeleton";

// The dashboard's shape: title and button, then photo rows.
export default function AdminLoading() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-11 w-40 rounded-full" />
      </div>
      <div className="divide-y divide-border-subtle overflow-hidden rounded-2xl border border-border-subtle bg-surface">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-3">
            <Skeleton className="size-14 shrink-0" />
            <div className="flex-1">
              <Skeleton className="h-5 w-48 max-w-full" />
              <Skeleton className="mt-2 h-4 w-32" />
            </div>
            <Skeleton className="hidden h-10 w-28 rounded-full sm:block" />
          </div>
        ))}
      </div>
    </div>
  );
}
