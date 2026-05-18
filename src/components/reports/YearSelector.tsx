"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useAvailableYears } from "@/hooks/use-available-years";
import { Skeleton } from "@/components/ui/skeleton";
import { YearCardEmptyState } from "@/components/shared/YearCardEmptyState";

interface YearSelectorProps {
  reportType: string;
  baseUrl: string;
}

export function YearSelector({ reportType, baseUrl }: YearSelectorProps) {
  const { data: years = [], isLoading, isError } = useAvailableYears(reportType);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-40 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (isError || years.length === 0) {
    return <YearCardEmptyState message="Belum ada laporan yang tersedia." />;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {years
        .sort((a, b) => b.year - a.year)
        .map((item) => (
          <Link
            key={item.year}
            href={`${baseUrl}/${item.year}`}
            className="group relative overflow-hidden rounded-4xl border border-border bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:border-primary hover:shadow-2xl hover:shadow-primary/20 active:scale-95"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative flex flex-col items-center justify-center p-8 sm:p-12 text-center">
              <span className="text-title-lg font-bold text-primary">{item.year}</span>
              <p className="mt-4 inline-flex items-center justify-center rounded-full bg-primary/5 px-4 py-1.5 text-sm font-semibold tracking-wide text-primary/80 sm:text-base">
                {item.count} Dokumen
              </p>
            </div>
          </Link>
        ))}
    </div>
  );
}
