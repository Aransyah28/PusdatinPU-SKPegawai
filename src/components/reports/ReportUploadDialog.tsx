"use client";

import { useEffect } from "react";
import { Loader2, X } from "lucide-react";
import { FormTextField } from "@/components/shared/FormTextField";
import { FormSelectField } from "@/components/shared/FormSelectField";
import { FileUploadDropzone } from "@/components/shared/FileUploadDropzone";
import { useReportUploadForm } from "@/hooks/use-report-upload-form";
import { MAX_UPLOAD_FILE_SIZE_MB } from "@/lib/constants";
import type { ReportType } from "@/lib/reports/report-types";

interface ReportUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultReportType: ReportType;
  defaultYear?: number;
  onSuccess: () => void;
}

export function ReportUploadDialog({
  open,
  onOpenChange,
  defaultReportType,
  defaultYear,
  onSuccess,
}: ReportUploadDialogProps) {
  const {
    description,
    file,
    handleFileChange,
    reportType,
    reportTypeOptions,
    resetForm,
    setDescription,
    setReportType,
    setTitle,
    setYear,
    title,
    uploadMutation,
    year,
    years,
  } = useReportUploadForm(defaultReportType, { defaultYear });

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return;
    }

    document.body.style.overflow = "unset";
  }, [open]);

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open, resetForm]);

  if (!open) return null;

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const handleSave = async () => {
    await uploadMutation.mutateAsync();
    onOpenChange(false);
    onSuccess();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-heading/40 p-4 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="max-h-[95vh] w-full max-w-lg animate-in fade-in zoom-in overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl duration-200"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-title-lg text-heading">Unggah Laporan</h2>
            <p className="mt-1 text-body-sm text-body/60">
              Tambahkan file laporan baru ke sistem.
            </p>
          </div>
          <button
            onClick={handleClose}
            className="touch-target rounded-full text-body/40 transition-all hover:bg-muted hover:text-body"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <FileUploadDropzone
            file={file}
            onFileChange={handleFileChange}
            helperText={`Jenis laporan dan tahun akan terdeteksi otomatis (Maks. ${MAX_UPLOAD_FILE_SIZE_MB} MB)`}
          />

          <FormTextField
            label="Judul Dokumen"
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Contoh: Laporan Kinerja 2025"
          />

          <FormSelectField
            label="Jenis Laporan"
            required
            value={reportType}
            onChange={(event) => setReportType(event.target.value as ReportType)}
            options={reportTypeOptions}
            placeholder="Pilih jenis laporan"
          />

          <FormSelectField
            label="Tahun"
            required
            value={year}
            onChange={(event) => setYear(event.target.value)}
            options={years.map((y) => ({ value: y, label: String(y) }))}
            placeholder={file ? "Tidak ada tahun — isi manual" : "Pilih tahun"}
          />

          <FormTextField
            label="Deskripsi (opsional)"
            multiline
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Keterangan tambahan mengenai laporan ini..."
          />
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={handleClose}
            className="rounded-full px-6 py-2.5 text-body-md font-bold text-body transition-all hover:bg-muted"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            disabled={!file || !title || !year || !reportType || uploadMutation.isPending}
            className="flex items-center gap-2 rounded-full bg-primary px-8 py-2.5 text-body-md font-bold text-white shadow-lg transition-all hover:bg-primary/90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploadMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Simpan Laporan
          </button>
        </div>
      </div>
    </div>
  );
}