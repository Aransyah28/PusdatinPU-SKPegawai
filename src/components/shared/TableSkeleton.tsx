import { Skeleton } from "@/components/ui/skeleton";

interface TableSkeletonProps {
  desktopCount?: number;
  mobileCount?: number;
}

export function TableSkeleton({ desktopCount = 5, mobileCount = 4 }: TableSkeletonProps) {
  return (
    <div className="space-y-4">
      {/* Desktop Skeleton */}
      <div className="hidden md:block overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        <div className="p-4 space-y-4">
          {Array.from({ length: desktopCount }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 border-b border-border/50 pb-4 last:border-0 last:pb-0">
              <Skeleton className="h-10 w-10 rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
              </div>
              <Skeleton className="h-10 w-24 rounded-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Skeleton */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {Array.from({ length: mobileCount }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-border bg-white p-4 shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-2 flex-1 mr-4">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <Skeleton className="h-5 w-12 rounded-full" />
            </div>
            <div className="pt-2 flex justify-end gap-2 border-t border-border/50">
              <Skeleton className="h-9 w-9 rounded-full" />
              <Skeleton className="h-9 w-9 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
