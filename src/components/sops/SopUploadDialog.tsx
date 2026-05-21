"use client";

import { useEffect } from "react";
import { FormTextField } from "@/components/shared/FormTextField";
import { FormSelectField } from "@/components/shared/FormSelectField";
import { FileUploadDropzone } from "@/components/shared/FileUploadDropzone";
import { BaseUploadDialog } from "@/components/shared/BaseUploadDialog";
import { useSopUploadForm } from "@/hooks/use-sop-upload-form";
import { MAX_UPLOAD_FILE_SIZE_MB } from "@/lib/constants";
import type { SopBidang } from "@/lib/sops/sop-types";

interface SopUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultBidang: SopBidang;
  defaultYear?: number;
  onSuccess: () => void;
}

export function SopUploadDialog({
  open,
  onOpenChange,
  defaultBidang,
  defaultYear,
  onSuccess,
}: SopUploadDialogProps) {
  const {
    description,
    file,
    handleFileChange,
    bidang,
    bidangOptions,
    resetForm,
    setDescription,
    setBidang,
    setTitle,
    setYear,
    title,
    uploadMutation,
    year,
    years,
  } = useSopUploadForm(defaultBidang, { defaultYear });

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
      title="Unggah SOP"
      description="Tambahkan file SOP baru ke sistem."
      onSave={handleSave}
      onCancel={handleCancel}
      isPending={uploadMutation.isPending}
      saveDisabled={!file || !title || !year || !bidang}
      saveLabel="Simpan SOP"
    >
      <FileUploadDropzone
        file={file}
        onFileChange={handleFileChange}
        helperText={`SOP akan diunggah sesuai bidang (Maks. ${MAX_UPLOAD_FILE_SIZE_MB} MB)`}
      />

      <FormTextField
        label="Judul Dokumen"
        required
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Contoh: SOP Keamanan Jaringan"
      />

      <FormSelectField
        label="Bidang"
        required
        value={bidang}
        onChange={(event) => setBidang(event.target.value as SopBidang)}
        options={bidangOptions}
        placeholder="Pilih bidang"
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
        placeholder="Keterangan tambahan mengenai SOP ini..."
      />
    </BaseUploadDialog>
  );
}
