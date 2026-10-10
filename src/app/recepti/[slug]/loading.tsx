import { Skeleton } from "@/components/Skeleton";

export default function RecipeLoading() {
  return (
    <div>
      <div className="border-b-[3px] border-rule bg-surface-muted">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.15fr_1fr]">
          <div>
            <Skeleton className="h-5 w-28 bg-border-subtle" />
            <Skeleton className="mt-5 h-14 w-4/5 bg-border-subtle sm:h-20" />
            <Skeleton className="mt-3 h-14 w-1/2 bg-border-subtle sm:h-20" />
            <Skeleton className="mt-6 h-5 w-full bg-border-subtle" />
            <div className="mt-6 grid grid-cols-3 gap-3 border-y-2 border-rule py-4">
              <Skeleton className="h-12 bg-border-subtle" />
              <Skeleton className="h-12 bg-border-subtle" />
              <Skeleton className="h-12 bg-border-subtle" />
            </div>
          </div>
          <Skeleton className="aspect-[4/3] w-full bg-border-subtle" />
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <Skeleton className="h-10 w-48" />
        <div className="mt-6 flex flex-col gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
