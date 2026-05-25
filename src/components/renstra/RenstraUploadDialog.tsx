"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { FormTextField } from "@/components/shared/FormTextField";
import { FileUploadDropzone } from "@/components/shared/FileUploadDropzone";
import { BaseUploadDialog } from "@/components/shared/BaseUploadDialog";
import { useRenstraUploadForm } from "@/hooks/renstra/use-renstra-upload-form";
import { MAX_UPLOAD_FILE_SIZE_MB } from "@/lib/constants";

interface RenstraUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folderId: string;
}

export function RenstraUploadDialog({ open, onOpenChange, folderId }: RenstraUploadDialogProps) {
  const {
    title, setTitle,
    year, setYear,
    description, setDescription,
    file, handleFileChange,
    resetForm,
    uploadMutation
  } = useRenstraUploadForm(folderId);

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
      title="Unggah Dokumen Renstra"
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
        placeholder="Contoh: Dokumen Renstra Bab 1"
      />

      <FormTextField
        label="Tahun"
        required
        value={year}
        onChange={(event) => setYear(event.target.value)}
        placeholder={file ? "Ketik tahun" : "Ketik tahun"}
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
