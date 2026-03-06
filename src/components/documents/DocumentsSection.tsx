"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye, Download, Trash2, Plus, FileText, Loader2, Search, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { formatFileSize, formatDate } from "@/lib/utils/formatters";
import { UploadDialog } from "./UploadDialog";
import { useState, useMemo } from "react";
import { CommonPagination } from "@/components/shared/CommonPagination";
import { Skeleton } from "@/components/ui/skeleton";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: documents = [], isLoading, isError } = useQuery<Document[]>({
    queryKey: ["documents"],
    queryFn: async () => {
      const res = await fetch("/api/documents");
      if (!res.ok) throw new Error("Gagal memuat data.");
      return res.json() as Promise<Document[]>;
    },
  });

  const uniqueYears = useMemo(() => {
    const years = documents.map((doc) => doc.year);
    return Array.from(new Set(years)).sort((a, b) => b - a);
  }, [documents]);

  const filteredDocuments = useMemo(() => {
    return documents
      .filter((doc) => {
        const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesYear = selectedYear === "all" || doc.year.toString() === selectedYear;
        return matchesSearch && matchesYear;
      })
      .sort((a, b) => {
        if (b.year !== a.year) {
          return b.year - a.year; // Year DESC
        }
        return a.title.localeCompare(b.title); // Title ASC
      });
  }, [documents, searchQuery, selectedYear]);

  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);
  const paginatedDocuments = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredDocuments.slice(start, start + itemsPerPage);
  }, [filteredDocuments, currentPage]);

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

  if (isError) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center">
        <p className="text-sm font-semibold text-destructive">
          Gagal memuat data. Silakan muat ulang halaman.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2 max-w-2xl">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-body/40" />
            <input
              type="text"
              placeholder="Cari nama SK..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-full border border-border bg-white pl-10 pr-4 py-2 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>
          
          <div className="relative">
            <select
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(e.target.value);
                setCurrentPage(1);
              }}
              className="appearance-none rounded-full border border-border bg-white pl-4 pr-10 py-2 text-sm font-medium outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10 cursor-pointer"
            >
              <option value="all">Semua Tahun</option>
              {uniqueYears.map((year) => (
                <option key={year} value={year.toString()}>
                  Tahun {year}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
              <ChevronDown className="h-4 w-4 text-body/40" />
            </div>
          </div>
        </div>

        {isAdmin && (
          <button
            onClick={() => setUploadOpen(true)}
            className="flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-primary/90 active:scale-95"
          >
            <Plus className="h-4 w-4" />
            Tambah SK
          </button>
        )}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
          <div className="p-4 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 border-b border-border/50 pb-4 last:border-0 last:pb-0">
                <Skeleton className="h-10 w-10 rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-1/3" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
                <Skeleton className="h-10 w-24 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      ) : filteredDocuments.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border py-20 text-center">
          <div className="rounded-full bg-muted p-4 mb-4">
            <FileText className="h-10 w-10 text-muted-foreground" />
          </div>
          <p className="text-lg font-bold text-heading">Belum ada dokumen</p>
          <p className="text-sm text-body/70 mt-1 max-w-xs">
            {searchQuery 
              ? `Tidak ditemukan dokumen untuk kata kunci "${searchQuery}"`
              : "Daftar Surat Keterangan Kepegawaian akan muncul di sini."}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="overflow-x-auto rounded-2xl border border-border bg-white shadow-sm">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-primary">
                  <th className="px-6 py-5 text-sm font-bold uppercase tracking-wider text-white">No</th>
                  <th className="px-6 py-5 text-sm font-bold uppercase tracking-wider text-white">Nama SK</th>
                  <th className="px-6 py-5 text-sm font-bold uppercase tracking-wider text-white text-center">Tahun</th>
                  <th className="px-6 py-5 text-sm font-bold uppercase tracking-wider text-white">Diunggah Oleh</th>
                  <th className="px-6 py-5 text-sm font-bold uppercase tracking-wider text-white">Tanggal Upload</th>
                  <th className="px-6 py-5 text-sm font-bold uppercase tracking-wider text-white">Ukuran</th>
                  <th className="px-6 py-5 text-sm font-bold uppercase tracking-wider text-white text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {paginatedDocuments.map((doc, idx) => (
                   <tr key={doc.id} className="transition-colors hover:bg-muted/10">
                    <td className="px-6 py-6 text-base font-medium text-body/40">
                      {(currentPage - 1) * itemsPerPage + idx + 1}
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-lg font-bold text-heading">{doc.title}</div>
                      {doc.description && (
                        <div className="mt-1 text-base text-body/60">{doc.description}</div>
                      )}
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="inline-flex items-center rounded-full bg-accent-blue/50 px-3 py-1 text-sm font-bold text-accent-blue-foreground">
                        {doc.year}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-base font-medium text-body">
                        {doc.uploaderName ?? <span className="text-body/30">—</span>}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-base text-body/70">
                        {formatDate(new Date(doc.createdAt))}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-base text-body/70">
                        {formatFileSize(doc.fileSize)}
                      </div>
                    </td>
                     <td className="px-6 py-5">
                      <div className="flex items-center justify-center gap-3">
                        <a
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="touch-target h-11 w-11 rounded-full bg-muted text-body transition-all hover:bg-muted/80"
                          title="Lihat"
                        >
                          <Eye className="h-5 w-5" />
                        </a>
                        <button
                          onClick={() => handleDownload(doc)}
                          disabled={downloadingId === doc.id}
                          className="touch-target h-11 w-11 rounded-full bg-accent-blue/20 text-accent-blue-foreground transition-all hover:bg-accent-blue/40 disabled:opacity-50"
                          title="Unduh"
                        >
                          {downloadingId === doc.id ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : (
                            <Download className="h-5 w-5" />
                          )}
                        </button>
                        {isAdmin && (
                          <button
                            onClick={() => handleDelete(doc.id)}
                            disabled={deletingId === doc.id}
                            className="touch-target h-11 w-11 rounded-full bg-accent-red/20 text-accent-red-foreground transition-all hover:bg-accent-red/40 disabled:opacity-50"
                            title="Hapus"
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

          <CommonPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

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
