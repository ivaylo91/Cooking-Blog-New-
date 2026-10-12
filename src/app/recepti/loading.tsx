import { RecipeCardSkeleton } from "@/components/RecipeCardSkeleton";
import { Skeleton } from "@/components/Skeleton";

export default function ReceptiLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <Skeleton className="h-11 w-48" />
      <div className="mt-6 flex gap-2 overflow-hidden">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-11 w-28 shrink-0 rounded-full" />
        ))}
      </div>
      <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <RecipeCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
