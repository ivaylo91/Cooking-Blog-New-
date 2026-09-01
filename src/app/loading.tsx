import { RecipeCardSkeleton } from "@/components/RecipeCardSkeleton";
import { Skeleton } from "@/components/Skeleton";

export default function HomeLoading() {
  return (
    <div>
      <section className="bg-surface-muted">
        <div className="mx-auto flex max-w-5xl flex-col items-center px-6 py-20 text-center sm:py-28">
          <Skeleton className="mb-4 h-6 w-32 rounded-full" />
          <Skeleton className="h-10 w-72 sm:h-12 sm:w-96" />
          <Skeleton className="mt-4 h-5 w-full max-w-xl" />
          <Skeleton className="mt-8 h-12 w-52 rounded-full" />
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-6 py-14">
        <div className="mb-14 flex flex-wrap justify-center gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-24 rounded-full" />
          ))}
        </div>

        <Skeleton className="mb-6 h-8 w-48" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <RecipeCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
