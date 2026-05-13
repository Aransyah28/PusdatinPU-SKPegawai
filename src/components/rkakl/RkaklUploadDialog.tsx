"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2, X } from "lucide-react";
import { FormTextField } from "@/components/shared/FormTextField";
import { FormSelectField } from "@/components/shared/FormSelectField";
import { FileUploadDropzone } from "@/components/shared/FileUploadDropzone";
import { MAX_UPLOAD_FILE_SIZE, MAX_UPLOAD_FILE_SIZE_MB } from "@/lib/constants";
import { useUploadRkakl } from "@/hooks/rkakl/use-rkakl-documents";

interface RkaklUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  defaultYear?: string;
}

export function RkaklUploadDialog({ open, onOpenChange, onSuccess, defaultYear }: RkaklUploadDialogProps) {
  const [title, setTitle] = useState("");
  const [year, setYear] = useState(defaultYear || "");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  const uploadMutation = useUploadRkakl();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      if (defaultYear && !year) {
        setYear(defaultYear);
      }
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open, defaultYear, year]);

  const resetForm = () => {
    setTitle("");
    setYear(defaultYear || "");
    setDescription("");
    setFile(null);
  };

  const handleFileChange = (selectedFile: File | null) => {
    if (selectedFile && selectedFile.size > MAX_UPLOAD_FILE_SIZE) {
      toast.error(`Ukuran file tidak boleh lebih dari ${MAX_UPLOAD_FILE_SIZE_MB} MB.`);
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

    if (!defaultYear) {
      const yearMatch = rawName.match(/\b(20\d{2})\b/);
      if (yearMatch) {
        setYear(yearMatch[1]);
      } else {
        setYear("");
      }
    }
  };

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
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-title-lg text-heading">
              Unggah Dokumen RKAKL
            </h2>
            <p className="text-body-sm text-body/60 mt-1">
              Tambahkan dokumen Rencana Kerja dan Anggaran baru ke sistem.
            </p>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="touch-target rounded-full text-body/40 hover:bg-muted hover:text-body transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
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
            options={years.map((y) => ({ value: y, label: String(y) }))}
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
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-full px-6 py-2.5 text-body-md font-bold text-body hover:bg-muted transition-all"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
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
