"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { UploadDialog } from "./UploadDialog";
import { useState, useMemo, useEffect, useRef } from "react";
import { CommonPagination } from "@/components/shared/CommonPagination";
import { DocumentsToolbar, type SortOrder } from "@/components/shared/DocumentsToolbar";
import { DocumentsEmptyState } from "@/components/shared/DocumentsEmptyState";
import { DocumentsAddButton } from "@/components/shared/DocumentsAddButton";
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
import { DocumentsDesktopList } from "./DocumentsDesktopList";
import { DocumentsMobileList } from "./DocumentsMobileList";

export interface Document {
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
  const [sortOrder, setSortOrder] = useState<SortOrder>("date-desc");
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
        if (sortOrder === "title-asc") {
          return a.title.localeCompare(b.title);
        }
        if (sortOrder === "title-desc") {
          return b.title.localeCompare(a.title);
        }
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        if (sortOrder === "date-desc") {
          return dateB - dateA;
        }
        if (sortOrder === "date-asc") {
          return dateA - dateB;
        }
        return 0;
      });
  }, [documents, searchQuery, selectedYear, sortOrder]);

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
      <DocumentsToolbar
        searchQuery={searchQuery}
        onSearchChange={(query) => {
          setSearchQuery(query);
          setCurrentPage(1);
        }}
        searchPlaceholder="Cari nama SK..."
        sortOrder={sortOrder}
        onSortChange={(order) => setSortOrder(order as any)}
        extraFilters={
          <div className="relative" ref={yearDropdownRef}>
            <button
              type="button"
              onClick={() => setYearDropdownOpen((open) => !open)}
              className="flex h-9 min-w-[132px] items-center justify-between gap-2.5 rounded-full border border-border bg-card/95 px-3 text-left text-sm font-medium text-foreground shadow-[0_1px_0_0_rgba(0,0,0,0.02),0_6px_14px_rgba(24,44,106,0.05)] transition-all duration-150 hover:border-border hover:shadow-[0_1px_0_0_rgba(0,0,0,0.02),0_8px_16px_rgba(24,44,106,0.07)] focus:outline-none focus:ring-2 focus:ring-primary/10"
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
              <div className="absolute right-0 sm:left-0 top-full z-20 mt-2 min-w-[132px] overflow-hidden rounded-2xl border border-border bg-white p-1 shadow-[0_14px_24px_rgba(24,44,106,0.1)]">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedYear("all");
                    setCurrentPage(1);
                    setYearDropdownOpen(false);
                  }}
                  className={`flex w-full items-center rounded-xl px-3 py-2 text-left text-sm transition-colors duration-150 hover:bg-muted/50 ${
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
                      className={`flex w-full items-center rounded-xl px-3 py-2 text-left text-sm transition-colors duration-150 hover:bg-muted/50 ${
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
        }
        actionButton={
          isAdmin ? (
            <DocumentsAddButton
              onClick={() => setUploadOpen(true)}
              label="Tambah SK"
            />
          ) : undefined
        }
      />

      {/* Content */}
      {isLoading ? (
        <div className="space-y-4">
          <div className="hidden md:block overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
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
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {Array.from({ length: 4 }).map((_, i) => (
               <div key={i} className="rounded-2xl border border-border bg-white p-4 shadow-sm space-y-4">
                 <div className="flex justify-between items-start">
                   <div className="space-y-2 flex-1 mr-4">
                     <Skeleton className="h-5 w-3/4" />
                     <Skeleton className="h-4 w-1/2" />
                   </div>
                   <Skeleton className="h-5 w-12 rounded-full" />
                 </div>
                 <div className="space-y-2">
                   <div className="flex justify-between"><Skeleton className="h-4 w-20" /><Skeleton className="h-4 w-32" /></div>
                   <div className="flex justify-between"><Skeleton className="h-4 w-20" /><Skeleton className="h-4 w-24" /></div>
                 </div>
                 <div className="pt-2 flex justify-end gap-2 border-t border-border/50">
                   <Skeleton className="h-9 w-9 rounded-full" />
                   <Skeleton className="h-9 w-9 rounded-full" />
                 </div>
               </div>
            ))}
          </div>
        </div>
      ) : filteredDocuments.length === 0 ? (
        <DocumentsEmptyState
          searchQuery={searchQuery}
          emptyMessage="Daftar Surat Keterangan Kepegawaian akan muncul di sini."
        />
      ) : (
        <div className="space-y-4">
          <DocumentsDesktopList
            documents={paginatedDocuments}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            isAdmin={isAdmin}
            downloadingId={downloadingId}
            deletingId={deletingId}
            onDownload={handleDownload}
            onDelete={handleDeleteClick}
          />

          <DocumentsMobileList
            documents={paginatedDocuments}
            isAdmin={isAdmin}
            downloadingId={downloadingId}
            deletingId={deletingId}
            onDownload={handleDownload}
            onDelete={handleDeleteClick}
          />

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
