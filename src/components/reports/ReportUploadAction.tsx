"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import type { ReportType } from "@/lib/reports/report-types";
import { ReportUploadDialog } from "@/components/reports/ReportUploadDialog";

interface ReportUploadActionProps {
  defaultReportType: ReportType;
  defaultYear?: number;
  label?: string;
  className?: string;
  onUploaded?: () => void;
}

export function ReportUploadAction({
  defaultReportType,
  defaultYear,
  label = "Tambah File",
  className,
  onUploaded,
}: ReportUploadActionProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
            onClick={() => setOpen(true)}
            className="group inline-flex h-12 min-w-[168px] items-center justify-center gap-2 rounded-[18px] bg-primary px-6 text-[15px] font-black tracking-tight text-white shadow-[0_5px_0_0_#ffd602,0_12px_24px_rgba(24,44,106,0.18)] transition-all duration-150 hover:-translate-y-[1px] hover:shadow-[0_7px_0_0_#ffd602,0_14px_28px_rgba(24,44,106,0.2)] active:translate-y-[2px] active:shadow-[0_4px_0_0_#ffd602,0_8px_16px_rgba(24,44,106,0.14)]"
          >
            <Plus className="h-4 w-4 text-[#ffd602] transition-transform duration-150 group-hover:scale-105" />
            Tambah Laporan
          </button>

      <ReportUploadDialog
        open={open}
        onOpenChange={setOpen}
        defaultReportType={defaultReportType}
        defaultYear={defaultYear}
        onSuccess={() => {
          onUploaded?.();
        }}
      />
    </>
  );
}
