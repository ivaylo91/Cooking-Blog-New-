import { RecipeCardSkeleton } from "@/components/RecipeCardSkeleton";
import { Skeleton } from "@/components/Skeleton";

export default function TarseneLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <Skeleton className="h-11 w-64" />
      <Skeleton className="mt-6 h-14 w-full max-w-2xl rounded-full" />
      <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <RecipeCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
