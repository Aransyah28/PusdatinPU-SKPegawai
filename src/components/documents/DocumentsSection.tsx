"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye, Download, Trash2, Plus, FileText, Loader2, Search, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { formatFileSize, formatDate } from "@/lib/utils/formatters";
import { UploadDialog } from "./UploadDialog";
import { useState, useMemo, useEffect, useRef } from "react";
import { CommonPagination } from "@/components/shared/CommonPagination";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const yearDropdownRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        yearDropdownRef.current &&
        !yearDropdownRef.current.contains(event.target as Node)
      ) {
        setYearDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/documents/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus dokumen.");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      toast.success("Dokumen berhasil dihapus.");
      setDeletingId(null);
      setDeleteConfirmOpen(false);
      setDocumentToDelete(null);
    },
    onError: () => {
      toast.error("Gagal menghapus dokumen.");
      setDeletingId(null);
      setDeleteConfirmOpen(false);
      setDocumentToDelete(null);
    },
  });

  const handleDeleteClick = (id: string) => {
    setDocumentToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (documentToDelete) {
      setDeletingId(documentToDelete);
      deleteMutation.mutate(documentToDelete);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmOpen(false);
    setDocumentToDelete(null);
  };

  const handleDownload = async (doc: Document) => {
    setDownloadingId(doc.id);
    await forceDownload(doc.fileUrl, doc.fileName);
    setDownloadingId(null);
  };

  if (isError) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center">
        <p className="text-label-lg text-destructive">
          Gagal memuat data. Silakan muat ulang halaman.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2 max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-body/40" />
            <input
              type="text"
              placeholder="Cari nama SK..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="h-9 w-full rounded-full border border-border bg-white pl-10 pr-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>
          
          <div className="relative" ref={yearDropdownRef}>
            <button
              type="button"
              onClick={() => setYearDropdownOpen((open) => !open)}
              className="flex h-9 min-w-[132px] items-center justify-between gap-2.5 rounded-full border border-[#ececec] bg-white/95 px-3 text-left text-sm font-medium text-foreground shadow-[0_1px_0_0_rgba(0,0,0,0.02),0_6px_14px_rgba(24,44,106,0.05)] transition-all duration-150 hover:border-[#e6e6e6] hover:shadow-[0_1px_0_0_rgba(0,0,0,0.02),0_8px_16px_rgba(24,44,106,0.07)] focus:outline-none focus:ring-2 focus:ring-primary/10"
              aria-haspopup="listbox"
              aria-expanded={yearDropdownOpen}
            >
              <span className="truncate">
                {selectedYear === "all" ? "Semua Tahun" : `Tahun ${selectedYear}`}
              </span>
              <ChevronDown
                className={`h-3.5 w-3.5 shrink-0 text-body/35 transition-transform duration-150 ${
                  yearDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {yearDropdownOpen && (
              <div className="absolute left-0 top-full z-20 mt-2 min-w-full overflow-hidden rounded-2xl border border-[#ececec] bg-white p-1 shadow-[0_14px_24px_rgba(24,44,106,0.1)]">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedYear("all");
                    setCurrentPage(1);
                    setYearDropdownOpen(false);
                  }}
                  className={`flex w-full items-center rounded-xl px-3 py-2 text-left text-sm transition-colors duration-150 hover:bg-[#f5f8ff] ${
                    selectedYear === "all" ? "bg-primary text-white hover:bg-primary" : "text-foreground"
                  }`}
                  role="option"
                  aria-selected={selectedYear === "all"}
                >
                  Semua Tahun
                </button>
                {uniqueYears.map((year) => {
                  const yearValue = year.toString();
                  const isSelected = selectedYear === yearValue;

                  return (
                    <button
                      key={year}
                      type="button"
                      onClick={() => {
                        setSelectedYear(yearValue);
                        setCurrentPage(1);
                        setYearDropdownOpen(false);
                      }}
                      className={`flex w-full items-center rounded-xl px-3 py-2 text-left text-sm transition-colors duration-150 hover:bg-[#f5f8ff] ${
                        isSelected ? "bg-primary text-white hover:bg-primary" : "text-foreground"
                      }`}
                      role="option"
                      aria-selected={isSelected}
                    >
                      Tahun {year}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {isAdmin && (
          <button
            onClick={() => setUploadOpen(true)}
            className="group inline-flex h-12 min-w-[168px] items-center justify-center gap-2 rounded-[18px] bg-primary px-6 text-[15px] font-black tracking-tight text-white shadow-[0_5px_0_0_#ffd602,0_12px_24px_rgba(24,44,106,0.18)] transition-all duration-150 hover:-translate-y-[1px] hover:shadow-[0_7px_0_0_#ffd602,0_14px_28px_rgba(24,44,106,0.2)] active:translate-y-[2px] active:shadow-[0_4px_0_0_#ffd602,0_8px_16px_rgba(24,44,106,0.14)]"
          >
            <Plus className="h-4 w-4 text-[#ffd602] transition-transform duration-150 group-hover:scale-105" />
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
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border py-14 text-center">
          <div className="mb-3 rounded-full bg-muted p-3">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-title-md font-semibold text-heading">Belum ada dokumen</p>
          <p className="mt-1 max-w-xs text-sm text-body/70">
            {searchQuery 
              ? `Tidak ditemukan dokumen untuk kata kunci "${searchQuery}"`
              : "Daftar Surat Keterangan Kepegawaian akan muncul di sini."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-2xl border border-border bg-white shadow-sm">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-primary">
                  <th className="px-4 py-2.5 text-sm font-semibold text-white">No</th>
                  <th className="px-4 py-2.5 text-sm font-semibold text-white">Judul SK</th>
                  <th className="px-4 py-2.5 text-center text-sm font-semibold text-white">Tahun</th>
                  <th className="whitespace-nowrap px-4 py-2.5 text-center text-sm font-semibold text-white">Diunggah Oleh</th>
                  <th className="w-48 px-4 py-2.5 text-center text-sm font-semibold text-white">Tanggal Unggah</th>
                  <th className="px-4 py-2.5 text-sm font-semibold text-white">Ukuran File</th>
                  <th className="px-4 py-2.5 text-center text-sm font-semibold text-white">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {paginatedDocuments.map((doc, idx) => (
                   <tr key={doc.id} className="transition-colors hover:bg-muted/10">
                    <td className="px-4 py-3.5 text-sm font-medium text-body/40">
                      {(currentPage - 1) * itemsPerPage + idx + 1}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="text-body-lg font-bold text-heading">{doc.title}</div>
                      {doc.description && (
                        <div className="mt-0.5 text-body-sm text-body/60">{doc.description}</div>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span className="inline-flex items-center rounded-full bg-accent-blue/50 px-2.5 py-0.5 text-xs font-semibold text-accent-blue-foreground">
                        {doc.year}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <div className="text-sm font-medium text-body">
                        {doc.uploaderName ?? <span className="text-body/30">—</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <div className="text-sm text-body/70">
                        {formatDate(new Date(doc.createdAt))}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="text-sm text-body/70">
                        {formatFileSize(doc.fileSize)}
                      </div>
                    </td>
                     <td className="px-4 py-3.5">
                      <div className="flex items-center justify-center gap-2">
                        <a
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-body transition-all hover:bg-muted/80"
                          title="Lihat"
                        >
                          <Eye className="h-4 w-4" />
                        </a>
                        <button
                          onClick={() => handleDownload(doc)}
                          disabled={downloadingId === doc.id}
                          className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-blue/20 text-accent-blue-foreground transition-all hover:bg-accent-blue/40 disabled:opacity-50"
                          title="Unduh"
                        >
                          {downloadingId === doc.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Download className="h-4 w-4" />
                          )}
                        </button>
                        {isAdmin && (
                          <button
                            onClick={() => handleDeleteClick(doc.id)}
                            disabled={deletingId === doc.id}
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-red/20 text-accent-red-foreground transition-all hover:bg-accent-red/40 disabled:opacity-50"
                            title="Hapus"
                          >
                            {deletingId === doc.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
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
        <>
          <UploadDialog
            open={uploadOpen}
            onOpenChange={setUploadOpen}
            onSuccess={() => {
              queryClient.invalidateQueries({ queryKey: ["documents"] });
            }}
          />

          <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Hapus Dokumen</AlertDialogTitle>
                <AlertDialogDescription>
                  Apakah Anda yakin ingin menghapus dokumen ini? Tindakan ini tidak dapat dibatalkan dan file akan dihapus secara permanen.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={cancelDelete}>Batal</AlertDialogCancel>
                <AlertDialogAction onClick={confirmDelete} className="bg-destructive font-semibold text-destructive-foreground hover:bg-destructive/90">
                  Hapus
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </div>
  );
}
