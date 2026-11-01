import { Skeleton } from "@/components/Skeleton";

/** Same shape as RecipeCard: warm body, card shadow, photo at 4/3. */
export function RecipeCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border-subtle bg-peach shadow-card">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="p-5">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="mt-4 h-7 w-1/2" />
      </div>
    </div>
  );
}
