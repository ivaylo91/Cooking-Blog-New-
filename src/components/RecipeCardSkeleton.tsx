import { Skeleton } from "@/components/Skeleton";

export function RecipeCardSkeleton() {
  return (
    <div className="flex flex-col border-2 border-rule bg-surface">
      <Skeleton className="aspect-[4/3] w-full border-b-2 border-rule" />
      <Skeleton className="h-8 w-full bg-border-subtle" />
      <div className="flex flex-col gap-2 p-3">
        <Skeleton className="h-7 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="mt-2 flex gap-3 border-t-2 border-rule pt-2">
          <Skeleton className="h-5 w-14" />
          <Skeleton className="h-5 w-14" />
          <Skeleton className="h-5 w-12" />
        </div>
      </div>
    </div>
  );
}
