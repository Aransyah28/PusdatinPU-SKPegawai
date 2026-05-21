"use client";

import { useEffect } from "react";
import { FormTextField } from "@/components/shared/FormTextField";
import { FormSelectField } from "@/components/shared/FormSelectField";
import { FileUploadDropzone } from "@/components/shared/FileUploadDropzone";
import { BaseUploadDialog } from "@/components/shared/BaseUploadDialog";
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
    if (!open) {
      resetForm();
    }
  }, [open, resetForm]);

  const handleSave = async () => {
    await uploadMutation.mutateAsync();
    onOpenChange(false);
    onSuccess();
  };

  const handleCancel = () => {
    resetForm();
  };

  return (
    <BaseUploadDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Unggah Laporan"
      description="Tambahkan file laporan baru ke sistem."
      onSave={handleSave}
      onCancel={handleCancel}
      isPending={uploadMutation.isPending}
      saveDisabled={!file || !title || !year || !reportType}
      saveLabel="Simpan Laporan"
    >
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

      <FormTextField
        label="Tahun"
        required
        value={year}
        onChange={(event) => setYear(event.target.value)}
        // datalistOptions={years.map((y) => ({ value: String(y), label: String(y) }))}
        placeholder={file ? "Tidak ada tahun — ketik manual" : "Ketik tahun"}
      />
      {/* 
      <FormSelectField
        label="Tahun"
        required
        value={year}
        onChange={(event) => setYear(event.target.value)}
        options={years.map((y) => ({ value: String(y), label: String(y) }))}
        placeholder={file ? "Tidak ada tahun — isi manual" : "Pilih tahun"}
      /> 
      */}

      <FormTextField
        label="Deskripsi (opsional)"
        multiline
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        placeholder="Keterangan tambahan mengenai laporan ini..."
      />
    </BaseUploadDialog>
  );
}