import { Skeleton } from "@/components/Skeleton";

export default function RecipeLoading() {
  return (
    <div>
      <Skeleton className="aspect-[4/3] w-full rounded-none sm:mx-auto sm:mt-6 sm:max-w-6xl sm:rounded-2xl md:aspect-[21/9]" />
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <Skeleton className="h-10 w-2/3 max-w-xl" />
        <Skeleton className="mt-3 h-5 w-full max-w-2xl" />
        <div className="mt-6 flex gap-8">
          <Skeleton className="h-14 w-20" />
          <Skeleton className="h-14 w-20" />
          <Skeleton className="h-14 w-20" />
        </div>
        <div className="mt-10 flex flex-col gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
