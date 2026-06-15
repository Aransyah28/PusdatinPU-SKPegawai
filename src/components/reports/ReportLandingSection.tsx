"use client";

import { YearSelector } from "@/components/reports/YearSelector";
import { ReportUploadAction } from "@/components/reports/ReportUploadAction";
import { PageHeader } from "@/components/shared/PageHeader";
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
      <div className="mb-10 lg:mb-12">
        <PageHeader 
          title={title} 
          description={description} 
          action={isAdmin ? <ReportUploadAction defaultReportType={reportType} /> : undefined}
        />
      </div>

      <div className="mb-8">
        <h2 className="mb-4 text-title-lg font-bold">Pilih Tahun</h2>
        <YearSelector reportType={reportType} baseUrl={baseUrl} />
      </div>

    </>
  );
}