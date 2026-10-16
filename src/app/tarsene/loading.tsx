import { Band } from "@/components/Band";
import { RecipeCardSkeleton } from "@/components/RecipeCardSkeleton";
import { Skeleton } from "@/components/Skeleton";

// The same peach band with its large search field as the loaded page.
export default function TarseneLoading() {
  return (
    <>
      <Band tone="peach" as="div" innerClassName="pb-8 pt-8 sm:pb-10 sm:pt-12">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="mt-6 h-14 w-full max-w-2xl rounded-full" />
      </Band>
      <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <RecipeCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </>
  );
}
