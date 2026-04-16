import { Skeleton } from "@/components/ui/skeleton";

const titleWidths = ["w-3/4", "w-2/3", "w-4/5"];
const subWidths = ["w-1/2", "w-2/5", "w-1/3"];

export function OpportunityCardSkeleton({ index = 0 }: { index?: number }) {
  return (
    <div className="flex flex-col rounded-xl border border-gray-200 dark:border-[#26262B] bg-white dark:bg-[#111113] shadow-sm px-5 pt-5 pb-5 gap-4">
      {/* badge */}
      <Skeleton className="h-5 w-24 rounded-full" />

      {/* price block */}
      <div className="space-y-2">
        <Skeleton className="h-9 w-36" />
        <Skeleton className="h-4 w-20" />
      </div>

      {/* savings */}
      <Skeleton className="h-4 w-40" />

      {/* comparison bars */}
      <div className="space-y-2.5">
        <div className="space-y-1">
          <div className="flex justify-between">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-1.5 w-full rounded-full" />
        </div>
        <div className="space-y-1">
          <div className="flex justify-between">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-1.5 w-3/4 rounded-full" />
        </div>
      </div>

      {/* divider + title + meta */}
      <div className="border-t border-gray-200 dark:border-[#26262B] pt-4 space-y-3">
        <div className="space-y-1">
          <div className="flex justify-between">
            <Skeleton className={`h-3 ${titleWidths[index % titleWidths.length]}`} />
            <Skeleton className="h-3 w-6" />
          </div>
          <Skeleton className="h-1.5 w-full rounded-full" />
        </div>
        <Skeleton className={`h-4 ${titleWidths[index % titleWidths.length]}`} />
        <Skeleton className={`h-4 ${subWidths[index % subWidths.length]}`} />
      </div>

      {/* CTA */}
      <Skeleton className="h-10 w-full rounded-lg" />
    </div>
  );
}

export function OpportunityGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <OpportunityCardSkeleton key={i} index={i} />
      ))}
    </div>
  );
}
