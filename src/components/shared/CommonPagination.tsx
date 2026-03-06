import React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface CommonPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  className?: string;
}

export function CommonPagination({
  currentPage,
  totalPages,
  onPageChange,
  isLoading,
  className,
}: CommonPaginationProps) {
  if (totalPages <= 1) return null;

  const renderPageButtons = () => {
    const pages = [];
    const showThreshold = 2;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - showThreshold && i <= currentPage + showThreshold)
      ) {
        pages.push(
          <button
            key={i}
            onClick={() => onPageChange(i)}
            disabled={isLoading}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition-all",
              currentPage === i
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {i}
          </button>
        );
      } else if (
        i === currentPage - showThreshold - 1 ||
        i === currentPage + showThreshold + 1
      ) {
        pages.push(
          <div
            key={i}
            className="flex h-9 w-9 items-center justify-center text-muted-foreground"
          >
            <MoreHorizontal className="h-4 w-4" />
          </div>
        );
      }
    }

    return pages;
  };

  return (
    <div className={cn("flex items-center justify-center gap-1", className)}>
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1 || isLoading}
        className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-all hover:bg-muted hover:text-foreground disabled:opacity-30"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <div className="flex items-center gap-1">{renderPageButtons()}</div>

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages || isLoading}
        className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-all hover:bg-muted hover:text-foreground disabled:opacity-30"
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
