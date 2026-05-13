"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { FormTextField } from "@/components/shared/FormTextField";
import { FormSelectField } from "@/components/shared/FormSelectField";
import { FileUploadDropzone } from "@/components/shared/FileUploadDropzone";
import { BaseUploadDialog } from "@/components/shared/BaseUploadDialog";
import { useRkaklUploadForm } from "@/hooks/rkakl/use-rkakl-upload-form";
import { MAX_UPLOAD_FILE_SIZE_MB } from "@/lib/constants";

interface RkaklUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  defaultYear?: string;
}

export function RkaklUploadDialog({ open, onOpenChange, onSuccess, defaultYear }: RkaklUploadDialogProps) {
  const {
    title, setTitle,
    year, setYear,
    description, setDescription,
    file, handleFileChange,
    years,
    resetForm,
    uploadMutation
  } = useRkaklUploadForm(defaultYear);

  useEffect(() => {
    if (open) {
      if (defaultYear && !year) {
        setYear(defaultYear);
      }
    }
  }, [open, defaultYear, year, setYear]);

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open, resetForm]);

  const handleSubmit = () => {
    if (!file || !title || !year) {
      toast.error("Data tidak lengkap.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("year", year);
    formData.append("description", description);

    uploadMutation.mutate(formData, {
      onSuccess: () => {
        toast.success("Dokumen RKAKL berhasil diunggah.");
        resetForm();
        onOpenChange(false);
        if (onSuccess) onSuccess();
      },
      onError: (err) => {
        toast.error(err.message);
      },
    });
  };

  const handleCancel = () => {
    resetForm();
  };

  return (
    <BaseUploadDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Unggah Dokumen RKAKL"
      description="Tambahkan dokumen Rencana Kerja dan Anggaran baru ke sistem."
      onSave={handleSubmit}
      onCancel={handleCancel}
      isPending={uploadMutation.isPending}
      saveDisabled={!file || !title || !year}
      saveLabel="Simpan Perubahan"
    >
      <FileUploadDropzone
        file={file}
        onFileChange={handleFileChange}
        helperText={`Judul akan terisi otomatis (Maks. ${MAX_UPLOAD_FILE_SIZE_MB} MB)`}
      />

      <FormTextField
        label="Judul Dokumen"
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Contoh: RKAKL 2025"
      />

      <FormSelectField
        label="Tahun"
        required
        value={year}
        onChange={(e) => setYear(e.target.value)}
        options={years.map((y) => ({ value: String(y), label: String(y) }))}
        placeholder="Pilih tahun"
        disabled={!!defaultYear}
      />

      <FormTextField
        label="Deskripsi (opsional)"
        multiline
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Keterangan tambahan mengenai dokumen ini..."
      />
    </BaseUploadDialog>
  );
}
