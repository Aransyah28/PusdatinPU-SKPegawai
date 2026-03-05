"use client";

import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, UploadCloud, X, FileText } from "lucide-react";

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

  const resetForm = () => {
    setTitle("");
    setYear("");
    setDescription("");
    setFile(null);
  };

  /**
   * Saat file dipilih:
   * 1. Auto-isi judul dari nama file (bersihkan ekstensi + format)
   * 2. Auto-extract tahun dari nama file (regex 20xx)
   *    → Jika ada: set tahun otomatis
   *    → Jika tidak ada: kosongkan agar user isi manual
   */
  const handleFileChange = (selectedFile: File | null) => {
    setFile(selectedFile);
    if (!selectedFile) return;

    // Hapus ekstensi .pdf dan bersihkan nama
    const rawName = selectedFile.name.replace(/\.pdf$/i, "");
    const cleanName = rawName
      .replace(/[_\-]+/g, " ") // underscore/dash → spasi
      .replace(/\s+/g, " ")    // spasi berlebih → 1 spasi
      .trim();

    // Title case: huruf pertama setiap kata kapital
    const titleCased = cleanName.replace(/\b\w/g, (c) => c.toUpperCase());
    setTitle(titleCased);

    // Extract tahun 4 digit yang dimulai 20xx dari nama file
    const yearMatch = rawName.match(/\b(20\d{2})\b/);
    if (yearMatch) {
      setYear(yearMatch[1]);
    } else {
      setYear(""); // kosongkan → user isi manual
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Unggah SK Kepegawaian
          </h2>
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-md p-1 text-gray-400 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* File upload — PERTAMA: admin pilih file dulu, judul & tahun auto-isi */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              File PDF <span className="text-red-500">*</span>
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
            />
            {file ? (
              <div className="flex items-center gap-3 rounded-md border border-blue-200 bg-blue-50 px-3 py-2">
                <FileText className="h-5 w-5 flex-shrink-0 text-blue-500" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-800">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  onClick={() => handleFileChange(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex w-full flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-gray-200 py-6 text-gray-400 hover:border-blue-300 hover:text-blue-500"
              >
                <UploadCloud className="h-8 w-8" />
                <span className="text-sm">Klik untuk memilih file PDF</span>
                <span className="text-xs text-gray-300">
                  Judul dan tahun akan terisi otomatis dari nama file
                </span>
              </button>
            )}
          </div>

          {/* Judul */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Judul Dokumen <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: SK Kepegawaian 2025"
              className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Tahun */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Tahun <span className="text-red-500">*</span>
            </label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
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

          {/* Deskripsi */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Deskripsi{" "}
              <span className="text-gray-400 font-normal">(opsional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Keterangan tambahan..."
              className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>


        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-md px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
          >
            Batal
          </button>
          <button
            onClick={() => uploadMutation.mutate()}
            disabled={!file || !title || !year || uploadMutation.isPending}
            className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploadMutation.isPending && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            Unggah
          </button>
        </div>
      </div>
    </div>
  );
}
