"use client";

import { YearSelector } from "@/components/reports/YearSelector";
import { ReportUploadAction } from "@/components/reports/ReportUploadAction";
import type { ReportType } from "@/lib/reports/report-types";

interface ReportLandingSectionProps {
  title: string;
  description: string;
  reportType: ReportType;
  baseUrl: string;
  isAdmin: boolean;
}

export function ReportLandingSection({
  title,
  description,
  reportType,
  baseUrl,
  isAdmin,
}: ReportLandingSectionProps) {
  return (
    <>
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between lg:mb-12">
        <div>
          <h1 className="text-headline-lg mb-1">{title}</h1>
          <p className="text-title-md mt-2 max-w-2xl text-body/80">{description}</p>
        </div>

        {isAdmin && <ReportUploadAction defaultReportType={reportType} />}
      </div>

      <div className="mb-8">
        <h2 className="mb-4 text-title-lg font-bold">Pilih Tahun</h2>
        <YearSelector reportType={reportType} baseUrl={baseUrl} />
      </div>

    </>
  );
}