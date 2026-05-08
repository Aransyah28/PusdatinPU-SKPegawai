"use client";

import { useEffect } from "react";
import { Loader2, X } from "lucide-react";
import { FormTextField } from "@/components/shared/FormTextField";
import { FormSelectField } from "@/components/shared/FormSelectField";
import { FileUploadDropzone } from "@/components/shared/FileUploadDropzone";
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
            <h2 className="text-title-lg text-heading">Unggah SOP</h2>
            <p className="mt-1 text-body-sm text-body/60">
              Tambahkan file SOP baru ke sistem.
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
            placeholder="Keterangan tambahan mengenai SOP ini..."
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
            disabled={!file || !title || !year || !bidang || uploadMutation.isPending}
            className="flex items-center gap-2 rounded-full bg-primary px-8 py-2.5 text-body-md font-bold text-white shadow-lg transition-all hover:bg-primary/90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploadMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Simpan SOP
          </button>
        </div>
      </div>
    </div>
  );
}
