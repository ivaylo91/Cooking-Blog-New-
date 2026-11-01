import { Band } from "@/components/Band";
import { RecipeCardSkeleton } from "@/components/RecipeCardSkeleton";
import { Skeleton } from "@/components/Skeleton";

// Keep the colourful kitchen backdrop and card proportions while loading.
export default function HomeLoading() {
  return (
    <div>
      <Band tone="peach" pattern as="div" innerClassName="py-8 sm:py-12">
        <div className="grid gap-4 rounded-3xl bg-peach p-5 sm:p-8 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:gap-16">
          <Skeleton className="h-20 w-full max-w-xl" />
          <Skeleton className="h-14 w-full max-w-xl" />
        </div>
        <div className="mt-7 grid overflow-hidden rounded-3xl border border-border-subtle bg-surface sm:mt-8 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <Skeleton className="aspect-[4/3] rounded-none md:aspect-auto md:min-h-[22rem]" />
          <div className="border-t-4 border-accent bg-butter p-6 sm:p-8 md:border-l-4 md:border-t-0 lg:p-10">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="mt-4 h-14 w-full" />
            <Skeleton className="mt-4 h-7 w-2/3" />
            <Skeleton className="mt-6 h-12 w-44 rounded-full" />
          </div>
        </div>
      </Band>
      <Band tone="plain" as="div" innerClassName="pt-10 sm:pt-12">
        <Skeleton className="mb-6 h-10 w-56" />
        <div className="flex flex-wrap gap-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-20 min-w-0 flex-[1_1_9rem] rounded-2xl sm:h-32 lg:flex-[1_1_0]" />
          ))}
        </div>
      </Band>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <Skeleton className="mb-6 h-8 w-48" />
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <RecipeCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
