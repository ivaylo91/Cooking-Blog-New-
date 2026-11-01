import { Band } from "@/components/Band";
import { RecipeCardSkeleton } from "@/components/RecipeCardSkeleton";
import { Skeleton } from "@/components/Skeleton";

// Match the compact introduction, lead dish and category links while loading.
export default function HomeLoading() {
  return (
    <div>
      <Band tone="plain" as="div" innerClassName="pb-8 pt-8 sm:pb-10 sm:pt-10">
        <div className="grid gap-3 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:gap-16">
          <Skeleton className="h-20 w-full max-w-xl" />
          <Skeleton className="h-14 w-full max-w-xl" />
        </div>
        <div className="mt-7 grid overflow-hidden rounded-2xl border border-border-subtle bg-surface sm:mt-8 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <Skeleton className="aspect-[4/3] rounded-none md:aspect-auto md:min-h-[22rem]" />
          <div className="p-6 sm:p-8 lg:p-10">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="mt-4 h-14 w-full" />
            <Skeleton className="mt-4 h-7 w-2/3" />
            <Skeleton className="mt-6 h-12 w-44 rounded-full" />
          </div>
        </div>
      </Band>
      <Band tone="plain" as="div">
        <div className="border-y border-border-subtle py-6">
          <Skeleton className="mb-3 h-7 w-56" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-11 w-28 rounded-full" />
            ))}
          </div>
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
