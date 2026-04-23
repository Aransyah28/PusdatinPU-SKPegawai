"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, Download, Eye, FileText, Loader2, Plus, Search, Trash2 } from "lucide-react";
import { formatDate, formatFileSize } from "@/lib/utils/formatters";
import { CommonPagination } from "@/components/shared/CommonPagination";
import { ReportUploadDialog } from "./ReportUploadDialog";
import { useYearReportTable } from "@/hooks/use-year-report-table";
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

import type { ReportDocumentRow } from "@/lib/reports/report-queries";
import type { ReportType } from "@/lib/reports/report-types";

interface YearReportDocumentsTableProps {
  documents: ReportDocumentRow[];
  isAdmin?: boolean;
  reportType: ReportType;
  year: number;
}

export function YearReportDocumentsTable({ 
  documents, 
  isAdmin = false,
  reportType,
  year 
}: YearReportDocumentsTableProps) {
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(event.target as Node)
      ) {
        setSortDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const {
    searchQuery,
    handleSearchChange,
    currentPage,
    setCurrentPage,
    uploadOpen,
    setUploadOpen,
    deletingId,
    downloadingId,
    filteredDocuments,
    paginatedDocuments,
    totalPages,
    handleDelete,
    confirmDelete,
    cancelDelete,
    deleteConfirmOpen,
    setDeleteConfirmOpen,
    handleDownload,
    handleUploadSuccess,
    itemsPerPage,
    sortOrder,
    setSortOrder
  } = useYearReportTable(documents, 10);

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-body/40" />
            <input
              type="text"
              placeholder="Cari judul laporan..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="h-9 w-full rounded-full border border-border bg-white pl-10 pr-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>
          <div className="relative" ref={sortDropdownRef}>
            <button
              type="button"
              onClick={() => setSortDropdownOpen((open) => !open)}
              className="flex h-9 min-w-[120px] items-center justify-between gap-2.5 rounded-full border border-[#ececec] bg-white/95 px-3 text-left text-sm font-medium text-foreground shadow-[0_1px_0_0_rgba(0,0,0,0.02),0_6px_14px_rgba(24,44,106,0.05)] transition-all duration-150 hover:border-[#e6e6e6] hover:shadow-[0_1px_0_0_rgba(0,0,0,0.02),0_8px_16px_rgba(24,44,106,0.07)] focus:outline-none focus:ring-2 focus:ring-primary/10"
              aria-haspopup="listbox"
              aria-expanded={sortDropdownOpen}
            >
              <span className="truncate">
                {sortOrder === "title-asc" && "A - Z"}
                {sortOrder === "title-desc" && "Z - A"}
                {sortOrder === "date-desc" && "Terbaru"}
                {sortOrder === "date-asc" && "Terlama"}
              </span>
              <ChevronDown
                className={`h-3.5 w-3.5 shrink-0 text-body/35 transition-transform duration-150 ${
                  sortDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {sortDropdownOpen && (
              <div className="absolute right-0 top-full z-20 mt-2 min-w-full overflow-hidden rounded-2xl border border-[#ececec] bg-white p-1 shadow-[0_14px_24px_rgba(24,44,106,0.1)]">
                {[
                  { value: "title-asc", label: "A - Z" },
                  { value: "title-desc", label: "Z - A" },
                  { value: "date-desc", label: "Terbaru" },
                  { value: "date-asc", label: "Terlama" },
                ].map((option) => {
                  const isSelected = sortOrder === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setSortOrder(option.value as any);
                        setSortDropdownOpen(false);
                      }}
                      className={`flex w-full items-center rounded-xl px-3 py-2 text-left text-sm transition-colors duration-150 hover:bg-[#f5f8ff] ${
                        isSelected ? "bg-primary text-white hover:bg-primary" : "text-foreground"
                      }`}
                      role="option"
                      aria-selected={isSelected}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      {filteredDocuments.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border py-14 text-center">
          <div className="mb-3 rounded-full bg-muted p-3">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-title-md font-semibold text-heading">Belum ada dokumen</p>
          <p className="mt-1 max-w-xs text-sm text-body/70">
            {searchQuery 
              ? `Tidak ditemukan dokumen untuk kata kunci "${searchQuery}"`
              : "Dokumen PDF untuk tahun ini belum tersedia."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="hidden md:block overflow-x-auto rounded-2xl border border-border bg-white shadow-sm">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-primary">
                  <th className="px-4 py-2.5 text-sm font-semibold text-white">No</th>
                  <th className="px-4 py-2.5 text-sm font-semibold text-white">Judul Laporan</th>
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
                      <div className="text-sm text-body/70">{formatDate(doc.createdAt)}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="text-sm text-body/70">{formatFileSize(doc.fileSize)}</div>
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
                            onClick={() => handleDelete(doc.id)}
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

          <div className="grid grid-cols-1 gap-4 md:hidden">
            {paginatedDocuments.map((doc) => (
              <div key={doc.id} className="relative flex flex-col gap-3 rounded-2xl border border-border bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-body-lg font-bold leading-tight text-heading">{doc.title}</h3>
                    {doc.description && <p className="mt-1 text-sm text-body/60">{doc.description}</p>}
                  </div>
                  <span className="inline-flex shrink-0 items-center rounded-full bg-accent-blue/50 px-2.5 py-0.5 text-xs font-semibold text-accent-blue-foreground">
                    {doc.year}
                  </span>
                </div>
                
                <div className="mt-1 flex flex-col gap-1.5 text-sm text-body/70">
                  <div className="flex items-center justify-between">
                    <span>Diunggah oleh:</span>
                    <span className="text-right font-medium text-body">{doc.uploaderName ?? "—"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Tanggal:</span>
                    <span className="text-right">{formatDate(doc.createdAt)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Ukuran:</span>
                    <span className="text-right">{formatFileSize(doc.fileSize)}</span>
                  </div>
                </div>

                <div className="mt-1 flex items-center justify-end gap-2 border-t border-border/50 pt-3">
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
                      onClick={() => handleDelete(doc.id)}
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
              </div>
            ))}
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
          <ReportUploadDialog
            open={uploadOpen}
            onOpenChange={setUploadOpen}
            defaultReportType={reportType}
            defaultYear={year}
            onSuccess={handleUploadSuccess}
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
