import { Skeleton } from "@/components/Skeleton";

export default function RecipeLoading() {
  return (
    <div>
      <Skeleton className="h-[42vh] min-h-[280px] w-full rounded-none" />

      <div className="mx-auto max-w-4xl px-6 py-10">
        <Skeleton className="h-6 w-full max-w-xl" />
        <Skeleton className="mt-2 h-6 w-2/3" />

        <div className="mt-5 flex flex-wrap gap-4 border-y border-border-subtle py-4">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-5 w-24" />
        </div>

        <div className="mt-5 flex justify-between">
          <Skeleton className="h-9 w-16 rounded-full" />
          <Skeleton className="h-9 w-40 rounded-full" />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,300px)_1fr]">
          <Skeleton className="h-72 w-full rounded-2xl" />
          <div className="flex flex-col gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
