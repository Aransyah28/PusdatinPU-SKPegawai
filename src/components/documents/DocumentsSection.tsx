"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye, Download, Trash2, Plus, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { formatFileSize, formatDate } from "@/lib/utils/formatters";
import { UploadDialog } from "./UploadDialog";
import { useState } from "react";

interface Document {
  id: string;
  title: string;
  year: number;
  description: string | null;
  fileUrl: string;
  fileName: string;
  fileSize: number | null;
  uploaderName: string | null;
  createdAt: string;
}

interface DocumentsSectionProps {
  isAdmin: boolean;
}

/**
 * Paksa download file dari URL (termasuk cross-origin seperti Vercel Blob).
 * Menggunakan fetch → blob → object URL → click trick.
 */
async function forceDownload(fileUrl: string, fileName: string) {
  try {
    const res = await fetch(fileUrl);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch {
    toast.error("Gagal mengunduh file.");
  }
}

export function DocumentsSection({ isAdmin }: DocumentsSectionProps) {
  const queryClient = useQueryClient();
  const [uploadOpen, setUploadOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const { data: documents = [], isLoading, isError } = useQuery<Document[]>({
    queryKey: ["documents"],
    queryFn: async () => {
      const res = await fetch("/api/documents");
      if (!res.ok) throw new Error("Gagal memuat data.");
      return res.json() as Promise<Document[]>;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/documents/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus dokumen.");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      toast.success("Dokumen berhasil dihapus.");
      setDeletingId(null);
    },
    onError: () => {
      toast.error("Gagal menghapus dokumen.");
      setDeletingId(null);
    },
  });

  const handleDelete = (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus dokumen ini?")) return;
    setDeletingId(id);
    deleteMutation.mutate(id);
  };

  const handleDownload = async (doc: Document) => {
    setDownloadingId(doc.id);
    await forceDownload(doc.fileUrl, doc.fileName);
    setDownloadingId(null);
  };

  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600">
        Gagal memuat data. Silakan muat ulang halaman.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Admin toolbar */}
      {isAdmin && (
        <div className="flex justify-end">
          <button
            onClick={() => setUploadOpen(true)}
            className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Tambah SK
          </button>
        </div>
      )}

      {/* Tabel */}
      {documents.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 py-16 text-center">
          <FileText className="mb-3 h-10 w-10 text-gray-300" />
          <p className="text-sm font-medium text-gray-500">
            Belum ada dokumen SK Kepegawaian.
          </p>
          {isAdmin && (
            <p className="mt-1 text-xs text-gray-400">
              Klik tombol &quot;Tambah SK&quot; untuk mengunggah dokumen baru.
            </p>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50 text-left">
                <th className="px-4 py-3 font-medium text-gray-600">No</th>
                <th className="px-4 py-3 font-bold text-black">Nama SK</th>
                <th className="px-4 py-3 font-bold text-black">Tahun</th>
                <th className="px-4 py-3 font-bold text-black">Diunggah Oleh</th>
                <th className="px-4 py-3 font-bold text-black">Tanggal Upload</th>
                <th className="px-4 py-3 font-bold text-black">Ukuran</th>
                <th className="px-4 py-3 text-center font-medium text-gray-600">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc, idx) => (
                <tr key={doc.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-400">{idx + 1}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-800">{doc.title}</div>
                    {doc.description && (
                      <div className="mt-0.5 text-xs text-gray-400">
                        {doc.description}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{doc.year}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {doc.uploaderName ?? <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {formatDate(new Date(doc.createdAt))}
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-sm">
                    {formatFileSize(doc.fileSize)}
                  </td>
                  <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-3">
                      {/* Lihat — buka PDF di tab baru */}
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center rounded-md bg-gray-100 p-2 text-gray-600 hover:bg-gray-200"
                        title="Lihat dokumen"
                      >
                        <Eye className="h-5 w-5" />
                      </a>

                      {/* Unduh — paksa download ke perangkat */}
                      <button
                        onClick={() => handleDownload(doc)}
                        disabled={downloadingId === doc.id}
                        className="flex items-center justify-center rounded-md bg-blue-50 p-2 text-blue-600 hover:bg-blue-100 disabled:opacity-50"
                        title="Unduh dokumen"
                      >
                        {downloadingId === doc.id ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <Download className="h-5 w-5" />
                        )}
                      </button>

                      {/* Hapus — hanya admin */}
                      {isAdmin && (
                        <button
                          onClick={() => handleDelete(doc.id)}
                          disabled={deletingId === doc.id}
                          className="flex items-center justify-center rounded-md bg-red-50 p-2 text-red-600 hover:bg-red-100 disabled:opacity-50"
                          title="Hapus dokumen"
                        >
                          {deletingId === doc.id ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : (
                            <Trash2 className="h-5 w-5" />
                          )}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Upload dialog (admin only) */}
      {isAdmin && (
        <UploadDialog
          open={uploadOpen}
          onOpenChange={setUploadOpen}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ["documents"] });
          }}
        />
      )}
    </div>
  );
}
