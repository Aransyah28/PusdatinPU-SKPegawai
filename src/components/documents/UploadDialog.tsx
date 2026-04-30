"use client";

import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, UploadCloud, X, FileText } from "lucide-react";
import { FormTextField } from "@/components/shared/FormTextField";

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function UploadDialog({ open, onOpenChange, onSuccess }: UploadDialogProps) {
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  // Background locking
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  const resetForm = () => {
    setTitle("");
    setYear("");
    setDescription("");
    setFile(null);
  };

  const handleFileChange = (selectedFile: File | null) => {
    if (selectedFile && selectedFile.size > 10 * 1024 * 1024) {
      toast.error("Ukuran file tidak boleh lebih dari 10 MB.");
      return;
    }

    setFile(selectedFile);
    if (!selectedFile) return;

    const rawName = selectedFile.name.replace(/\.pdf$/i, "");
    const cleanName = rawName
      .replace(/[_\-]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const titleCased = cleanName.replace(/\b\w/g, (c) => c.toUpperCase());
    setTitle(titleCased);

    const yearMatch = rawName.match(/\b(20\d{2})\b/);
    if (yearMatch) {
      setYear(yearMatch[1]);
    } else {
      setYear("");
    }
  };

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!file || !title || !year) throw new Error("Data tidak lengkap.");

      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title);
      formData.append("year", year);
      formData.append("description", description);

      const res = await fetch("/api/documents", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json() as { error: string };
        throw new Error(err.error ?? "Gagal mengupload.");
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success("Dokumen berhasil diunggah.");
      resetForm();
      onOpenChange(false);
      onSuccess();
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  if (!open) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-heading/40 p-4 backdrop-blur-sm"
      onClick={() => onOpenChange(false)}
    >
      <div 
        className="w-full max-w-lg max-h-[95vh] overflow-y-auto rounded-2xl bg-card p-6 shadow-2xl animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-title-lg text-heading">
              Unggah SK Kepegawaian
            </h2>
            <p className="text-body-sm text-body/60 mt-1">
              Tambahkan dokumen surat keterangan baru ke sistem.
            </p>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="touch-target rounded-full text-body/40 hover:bg-muted hover:text-body transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* File upload */}
          <div className="space-y-2">
            <label className="text-body-sm font-semibold text-heading/80 ml-1">
              File PDF <span className="text-destructive">*</span>
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
            />
            {file ? (
              <div className="flex items-center gap-4 rounded-xl border border-primary/20 bg-primary/5 p-4 transition-all">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FileText className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-body-md font-bold text-heading">
                    {file.name}
                  </p>
                  <p className="text-label-md text-body/60">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  onClick={() => handleFileChange(null)}
                  className="touch-target rounded-full text-body/40 hover:bg-muted hover:text-destructive transition-all"
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
                    Judul dan tahun akan terisi otomatis (Maks. 10 MB)
                  </p>
                </div>
              </button>
            )}
          </div>

          <FormTextField
            label="Judul Dokumen"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Contoh: SK Kepegawaian 2025"
          />

          <div className="space-y-1.5">
            <label className="text-body-sm font-semibold text-heading/80 ml-1">
              Tahun <span className="text-destructive">*</span>
            </label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-body-md transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="" disabled>
                {file ? "Tidak ada tahun — isi manual" : "Pilih tahun"}
              </option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          <FormTextField
            label="Deskripsi (opsional)"
            multiline
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Keterangan tambahan mengenai dokumen ini..."
          />
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-full px-6 py-2.5 text-body-md font-bold text-body hover:bg-muted transition-all"
          >
            Batal
          </button>
          <button
            onClick={() => uploadMutation.mutate()}
            disabled={!file || !title || !year || uploadMutation.isPending}
            className="flex items-center gap-2 rounded-full bg-primary px-8 py-2.5 text-body-md font-bold text-white shadow-lg transition-all hover:bg-primary/90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploadMutation.isPending && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
}
