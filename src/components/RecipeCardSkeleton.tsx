import { Skeleton } from "@/components/Skeleton";

export function RecipeCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl bg-surface-muted">
      <Skeleton className="aspect-[4/3] w-full rounded-none bg-border-subtle" />
      <div className="p-4">
        <Skeleton className="h-6 w-3/4 bg-border-subtle" />
        <Skeleton className="mt-2 h-4 w-1/2 bg-border-subtle" />
      </div>
    </div>
  );
}
