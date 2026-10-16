import { Skeleton } from "@/components/Skeleton";

// The recipe page's shape: the photo on a tinted band (the category, and so
// its colour, is not known yet, so peach stands in), then the title, facts
// and the ingredients card beside the method.
export default function RecipeLoading() {
  return (
    <div>
      <div className="bg-peach">
        <div className="mx-auto max-w-6xl sm:px-6 sm:pt-6">
          <Skeleton className="h-[40svh] w-full rounded-none sm:aspect-[4/3] sm:h-auto sm:rounded-3xl md:aspect-[21/9] lg:aspect-[16/5]" />
        </div>
        <div className="mx-auto max-w-6xl px-4 pb-8 pt-5 sm:px-6 sm:pt-8">
          <Skeleton className="h-12 w-2/3 max-w-xl" />
          <Skeleton className="mt-3 h-5 w-full max-w-2xl" />
          <div className="mt-6 flex gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-20" />
            ))}
          </div>
        </div>
      </div>
      <div className="mx-auto grid max-w-6xl gap-14 px-4 py-8 sm:px-6 md:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] md:gap-12 md:py-10 lg:grid-cols-[minmax(0,25rem)_minmax(0,1fr)] lg:gap-16">
        <div className="flex flex-col gap-3 rounded-3xl bg-surface p-5 shadow-card sm:p-6">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
        <div className="flex flex-col gap-4">
          <Skeleton className="h-14 w-full rounded-full sm:w-64" />
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
