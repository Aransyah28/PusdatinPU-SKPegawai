"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useAvailableYears } from "@/hooks/use-available-years";
import { Skeleton } from "@/components/ui/skeleton";

interface YearSelectorProps {
  reportType: string;
  baseUrl: string;
}

export function YearSelector({ reportType, baseUrl }: YearSelectorProps) {
  const { data: years = [], isLoading, isError } = useAvailableYears(reportType);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-lg" />
        ))}
      </div>
    );
  }

  if (isError || years.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-muted/30 py-12 text-center">
        <p className="text-body-md text-body/60">Belum ada laporan yang tersedia.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 gap-4 lg:grid-cols-4">
      {years
        .sort((a, b) => b.year - a.year)
        .map((item) => (
          <Link
            key={item.year}
            href={`${baseUrl}/${item.year}`}
            className="group relative overflow-hidden rounded-lg border border-border bg-white transition-all hover:border-primary hover:shadow-md active:scale-95"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="relative flex flex-col items-center justify-center py-6 px-4 sm:py-8 text-center">
              <span className="text-title-lg font-bold text-primary">{item.year}</span>
              <p className="text-label-md mt-2 text-body/60">{item.count} file</p>
            </div>
          </Link>
        ))}
    </div>
  );
}
