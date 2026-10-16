import { Band } from "@/components/Band";
import { RecipeCardSkeleton } from "@/components/RecipeCardSkeleton";
import { Skeleton } from "@/components/Skeleton";

// The same peach title band and chip row as the loaded page.
export default function ReceptiLoading() {
  return (
    <>
      <Band tone="peach" as="div" innerClassName="pb-8 pt-8 sm:pb-10 sm:pt-12">
        <Skeleton className="h-12 w-48" />
      </Band>
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6">
        <div className="flex gap-2 overflow-hidden">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-11 w-28 shrink-0 rounded-full" />
          ))}
        </div>
        <Skeleton className="mt-4 h-11 w-48 rounded-full" />
        <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <RecipeCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </>
  );
}
