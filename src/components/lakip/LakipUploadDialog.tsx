"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { FormTextField } from "@/components/shared/FormTextField";
import { FileUploadDropzone } from "@/components/shared/FileUploadDropzone";
import { BaseUploadDialog } from "@/components/shared/BaseUploadDialog";
import { useLakipUploadForm } from "@/hooks/lakip/use-lakip-upload-form";
import { MAX_UPLOAD_FILE_SIZE_MB } from "@/lib/constants";

interface LakipUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folderSlug: string;
}

export function LakipUploadDialog({ open, onOpenChange, folderSlug }: LakipUploadDialogProps) {
  const {
    title, setTitle,
    year, setYear,
    description, setDescription,
    file, handleFileChange,
    resetForm,
    uploadMutation
  } = useLakipUploadForm(folderSlug);

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
        toast.success("Dokumen berhasil diunggah.");
        resetForm();
        onOpenChange(false);
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
      title="Unggah Dokumen LAKIP"
      description="Tambahkan dokumen baru ke dalam folder ini."
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
        placeholder="Contoh: Laporan LAKIP 2024"
      />

      <FormTextField
        label="Tahun"
        required
        value={year}
        onChange={(event) => setYear(event.target.value)}
        placeholder="Contoh: 2024"
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
