import { Skeleton } from "@/components/Skeleton";

/** Same shape as RecipeCard: white body, card shadow, photo at 4/3. */
export function RecipeCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl bg-surface shadow-card">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="p-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="mt-2.5 h-5 w-1/2" />
      </div>
    </div>
  );
}
