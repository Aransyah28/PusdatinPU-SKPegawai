---
description: implement pagination with a mobile carousel and desktop grid view
---

# Pagination Implementation Workflow

This workflow guides you through implementing a paginated list with the following features:

- **Desktop/Tablet**: Grid view with traditional page-based pagination.
- **Mobile**: Swipeable carousel with progressive loading (loads more items as you scroll).
- Skeleton loaders for both views.

> [!IMPORTANT]
> **Items Per Page:**
>
> - **Desktop** (≥1024px): 6 items per page (3 columns, 2 rows)
> - **Tablet** (≥768px): 4 items per page (2 columns, 2 rows)
> - **Mobile** (<768px): Uses carousel with progressive loading (4 initial items)

## Prerequisites

Ensure the following components and hooks exist in the project:

- `@/components/ui/carousel` (Carousel, CarouselContent, CarouselItem)
- `@/components/features/common/CommonPagination`
- A data fetching hook (e.g., `useMyData`) that returns:
  - `data`: The paginated data for the current page.
  - `allData`: The full filtered data (used for mobile carousel progressive loading).
  - `isLoading`: Boolean for loading state.
  - `page`, `setPage`, `totalPages`: Pagination state.
  - `itemsPerPage`: Number of items per page (can be dynamic via `useItemsPerPage`).
  - Filter state (e.g., `searchQuery`, `filterX`).

## Steps

### 1. Create the Mobile Carousel Hook

Create a hook at `src/hooks/ui/use-[feature]-mobile-carousel.ts`.

```typescript
"use client";

import { useState, useEffect } from "react";
import { type CarouselApi } from "@/components/ui/carousel";

interface UseFeatureMobileCarouselProps {
  itemsCount: number;
  // Add all filter dependencies here
  filter1: string;
  filter2: string;
}

export function useFeatureMobileCarousel({
  itemsCount,
  filter1,
  filter2,
}: UseFeatureMobileCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [limit, setLimit] = useState(4); // Initial items to show
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    const onSelect = () => {
      const index = api.selectedScrollSnap();
      setCurrent(index);

      // Load more when reaching the skeleton
      if (index === limit && limit < itemsCount && !isLoadingMore) {
        setIsLoadingMore(true);
        setTimeout(() => {
          setLimit((prev) => prev + 4);
          setIsLoadingMore(false);
        }, 1500);
      }
    };

    api.on("select", onSelect);
    return () => api.off("select", onSelect);
  }, [api, limit, itemsCount, isLoadingMore]);

  // Reset on filter change
  useEffect(() => {
    if (api) api.scrollTo(0);
    setLimit(4);
    setCurrent(0);
    setIsLoadingMore(false);
  }, [filter1, filter2, api]); // Add all filter dependencies

  const showSkeleton = limit < itemsCount;

  return { setApi, current, limit, isLoadingMore, showSkeleton };
}
```

### 2. Update the Data Fetching Hook

Ensure your data hook (`src/hooks/api/use-[feature].ts`) returns both paginated and all filtered data.

```typescript
// Inside your hook
const itemsPerPage = useItemsPerPage(); // Or a constant
const paginatedData = allFilteredData.slice(
  (page - 1) * itemsPerPage,
  page * itemsPerPage,
);

return {
  data: paginatedData, // For grid view
  allFilteredData, // For mobile carousel
  page,
  setPage: handlePageChange,
  totalPages,
  itemsPerPage,
  // ... other state
};
```

### 3. Implement the Page Component

Structure your page component as follows:

```tsx
"use client";

import { useRef } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { CommonPagination } from "@/components/features/common/CommonPagination";
import { useFeatureMobileCarousel } from "@/hooks/ui/use-[feature]-mobile-carousel";
import { useFeature } from "@/hooks/api/use-[feature]";
import { FeatureCard } from "@/components/features/[feature]/FeatureCard";
import { FeatureCardSkeleton } from "@/components/features/[feature]/FeatureCardSkeleton";
import { EmptyState } from "@/components/features/classes/EmptyState";

export default function FeaturePage() {
  const {
    data: paginatedData,
    allFilteredData,
    isLoading,
    page,
    totalPages,
    setPage,
    // Filters
    filter1,
    filter2,
  } = useFeature();

  const {
    setApi: setCarouselApi,
    current: carouselCurrent,
    limit: carouselLimit,
    showSkeleton: carouselShowSkeleton,
  } = useFeatureMobileCarousel({
    itemsCount: allFilteredData.length,
    filter1,
    filter2,
  });

  const gridRef = useRef<HTMLDivElement>(null);

  return (
    <section className="flex flex-col gap-8">
      {/* Filters... */}

      {/* Mobile View: Carousel */}
      <div className="-ml-4 block w-[calc(100%+32px)] md:hidden">
        <Carousel
          setApi={setCarouselApi}
          opts={{ align: "center", loop: false, containScroll: false }}
          className="w-full"
        >
          <CarouselContent className="-ml-4 px-2 py-4">
            {isLoading ? (
              <CarouselItem className="basis-[85%] pl-4">
                <div style={{ transform: "scale(1.025)" }}>
                  <FeatureCardSkeleton />
                </div>
              </CarouselItem>
            ) : allFilteredData.length > 0 ? (
              <>
                {allFilteredData.slice(0, carouselLimit).map((item, index) => (
                  <CarouselItem key={item.id} className="basis-[85%] pl-4">
                    <div
                      className="h-full transition-transform duration-300 ease-out"
                      style={{
                        transform:
                          index === carouselCurrent
                            ? "scale(1.025)"
                            : "scale(0.98)",
                      }}
                    >
                      <FeatureCard {...item} />
                    </div>
                  </CarouselItem>
                ))}

                {carouselShowSkeleton && (
                  <CarouselItem key="skeleton" className="basis-[85%] pl-4">
                    <div
                      style={{
                        transform:
                          carouselCurrent === carouselLimit
                            ? "scale(1.025)"
                            : "scale(0.98)",
                      }}
                    >
                      <FeatureCardSkeleton />
                    </div>
                  </CarouselItem>
                )}
              </>
            ) : (
              <CarouselItem className="basis-full pl-4">
                <EmptyState title="No items found" />
              </CarouselItem>
            )}
          </CarouselContent>
        </Carousel>
      </div>

      {/* Desktop/Tablet View: Grid */}
      <div
        ref={gridRef}
        className="hidden scroll-mt-[84px] grid-cols-1 gap-6 md:grid md:grid-cols-2 xl:grid-cols-3"
      >
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <FeatureCardSkeleton key={i} />
          ))
        ) : paginatedData.length > 0 ? (
          paginatedData.map((item) => <FeatureCard key={item.id} {...item} />)
        ) : (
          <div className="col-span-full">
            <EmptyState title="No items found" />
          </div>
        )}
      </div>

      {/* Pagination - Hidden on Mobile */}
      <div className="hidden md:block">
        <CommonPagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(newPage) => {
            setPage(newPage);
            gridRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }}
          isLoading={isLoading}
        />
      </div>
    </section>
  );
}
```

## Checklist

- [ ] Mobile carousel hook created.
- [ ] Data hook returns `allFilteredData`.
- [ ] Page component refactored with mobile carousel and grid.
- [ ] Pagination hidden on mobile (`hidden md:block`).
- [ ] Skeleton loaders work correctly for both views.
- [ ] Progressive loading works on mobile (4 -> 8 -> 12...).
- [ ] Scale animation on focused carousel item.
