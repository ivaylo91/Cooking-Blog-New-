import { RecipeCardSkeleton } from "@/components/RecipeCardSkeleton";
import { Skeleton } from "@/components/Skeleton";

export default function HomeLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6">
      <Skeleton className="h-12 w-3/4 max-w-2xl" />
      <Skeleton className="mt-3 h-6 w-1/2 max-w-md" />
      <Skeleton className="mt-8 aspect-[4/3] w-full rounded-2xl md:aspect-[16/10]" />
      <div className="mt-14 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <RecipeCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
