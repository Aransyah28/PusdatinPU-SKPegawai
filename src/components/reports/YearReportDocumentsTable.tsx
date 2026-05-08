"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, Download, Eye, FileText, Loader2, Plus, Search, Trash2 } from "lucide-react";
import { formatDate, formatFileSize } from "@/lib/utils/formatters";
import { CommonPagination } from "@/components/shared/CommonPagination";
import { ReportUploadDialog } from "./ReportUploadDialog";
import { DocumentsToolbar, type SortOrder } from "@/components/shared/DocumentsToolbar";
import { DocumentsEmptyState } from "@/components/shared/DocumentsEmptyState";
import { DocumentsAddButton } from "@/components/shared/DocumentsAddButton";
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
      <DocumentsToolbar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Cari judul laporan..."
        sortOrder={sortOrder as SortOrder}
        onSortChange={(order) => setSortOrder(order as any)}
        actionButton={
          isAdmin ? (
            <DocumentsAddButton
              onClick={() => setUploadOpen(true)}
              label="Tambah Laporan"
            />
          ) : undefined
        }
      />

      {/* Content */}
      {filteredDocuments.length === 0 ? (
        <DocumentsEmptyState
          searchQuery={searchQuery}
          emptyMessage="Dokumen PDF untuk tahun ini belum tersedia."
        />
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
