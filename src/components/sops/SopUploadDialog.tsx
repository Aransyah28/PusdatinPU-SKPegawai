"use client";

import { useEffect, useRef } from "react";
import { Loader2, UploadCloud, X, FileText } from "lucide-react";
import { FormTextField } from "@/components/shared/FormTextField";
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
  const fileInputRef = useRef<HTMLInputElement>(null);
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
      fileInputRef.current && (fileInputRef.current.value = "");
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
          <div className="space-y-2">
            <label className="ml-1 text-body-sm font-semibold text-heading/80">
              File PDF <span className="text-destructive">*</span>
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(event) => handleFileChange(event.target.files?.[0] ?? null)}
            />
            {file ? (
              <div className="flex items-center gap-4 rounded-xl border border-primary/20 bg-primary/5 p-4 transition-all">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FileText className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-body-md font-bold text-heading">{file.name}</p>
                  <p className="text-label-md text-body/60">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  onClick={() => handleFileChange(null)}
                  className="touch-target rounded-full text-body/40 transition-all hover:bg-muted hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="group flex w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border py-6 transition-all hover:border-primary/50 hover:bg-primary/5"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground transition-all group-hover:bg-primary/10 group-hover:text-primary">
                  <UploadCloud className="h-7 w-7" />
                </div>
                <div className="text-center">
                  <p className="text-body-md font-bold text-heading">Klik untuk memilih file PDF</p>
                  <p className="mt-1 text-label-md text-body/60">
                    SOP akan diunggah sesuai bidang (Maks. {MAX_UPLOAD_FILE_SIZE_MB} MB)
                  </p>
                </div>
              </button>
            )}
          </div>

          <FormTextField
            label="Judul Dokumen"
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Contoh: SOP Keamanan Jaringan"
          />

          <div className="space-y-1.5">
            <label className="ml-1 text-body-sm font-semibold text-heading/80">
              Bidang <span className="text-destructive">*</span>
            </label>
            <select
              value={bidang}
              onChange={(event) => setBidang(event.target.value as SopBidang)}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-body-md transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="" disabled>
                Pilih bidang
              </option>
              {bidangOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="ml-1 text-body-sm font-semibold text-heading/80">
              Tahun <span className="text-destructive">*</span>
            </label>
            <select
              value={year}
              onChange={(event) => setYear(event.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-body-md transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="" disabled>
                {file ? "Tidak ada tahun — isi manual" : "Pilih tahun"}
              </option>
              {years.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

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
