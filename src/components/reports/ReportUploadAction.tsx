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
        className={
          className ??
          "inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-body-md font-bold text-white shadow-lg transition-all hover:bg-primary/90 active:scale-95"
        }
      >
        <Plus className="h-4 w-4" />
        {label}
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
