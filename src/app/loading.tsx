import { RecipeCardSkeleton } from "@/components/RecipeCardSkeleton";
import { Skeleton } from "@/components/Skeleton";

export default function HomeLoading() {
  return (
    <div>
      <section className="border-b-[3px] border-rule bg-brand">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <Skeleton className="h-16 w-4/5 bg-white/20 sm:h-24" />
          <Skeleton className="mt-3 h-16 w-3/5 bg-white/20 sm:h-24" />
          <Skeleton className="mt-6 h-6 w-full max-w-xl bg-white/20" />
          <Skeleton className="mt-8 h-14 w-56 bg-white/30" />
        </div>
      </section>
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="mb-6 mt-14 h-10 w-64" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <RecipeCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
