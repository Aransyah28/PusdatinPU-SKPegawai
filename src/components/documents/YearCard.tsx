import Link from "next/link";
import * as React from "react";

interface YearCardProps {
  href: string;
  year: number | string;
  count: number;
}

export function YearCard({ href, year, count }: YearCardProps) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-4xl border border-border bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:border-primary hover:shadow-2xl hover:shadow-primary/20 active:scale-95 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative flex flex-col items-center justify-center p-8 sm:p-12 text-center">
        <span className="text-title-lg font-bold text-primary">{year}</span>
        <p className="mt-4 inline-flex items-center justify-center rounded-full bg-primary/5 px-4 py-1.5 text-sm font-semibold tracking-wide text-primary/80 sm:text-base">
          {count} Dokumen
        </p>
      </div>
    </Link>
  );
}
