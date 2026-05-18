import { Skeleton } from "@/components/ui/skeleton";

interface YearCardSkeletonProps {
  count?: number;
}

export function YearCardSkeleton({ count = 6 }: YearCardSkeletonProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-40 rounded-2xl" />
      ))}
    </div>
  );
}
