import { Band } from "@/components/Band";
import { RecipeCardSkeleton } from "@/components/RecipeCardSkeleton";
import { Skeleton } from "@/components/Skeleton";

// Mirrors the home page's spreads (peach opening, sage shelves, plain grid),
// so the colour blocks are already in place when the content streams in.
export default function HomeLoading() {
  return (
    <div>
      <Band tone="peach" as="div" innerClassName="pb-12 pt-10 sm:pb-16 sm:pt-14">
        <Skeleton className="h-12 w-3/4 max-w-2xl" />
        <Skeleton className="mt-3 h-6 w-1/2 max-w-md" />
        <Skeleton className="mt-10 aspect-[4/3] w-full rounded-3xl md:aspect-auto md:h-[26rem]" />
      </Band>
      <Band tone="sage" as="div" innerClassName="py-12 sm:py-14">
        <Skeleton className="mb-6 h-8 w-40" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-2xl" />
          ))}
        </div>
      </Band>
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <Skeleton className="mb-6 h-8 w-48" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <RecipeCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
