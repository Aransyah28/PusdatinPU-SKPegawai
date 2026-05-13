"use client";

import { ReportUploadDialog } from "./ReportUploadDialog";
import { DocumentsToolbar, type SortOrder } from "@/components/shared/DocumentsToolbar";
import { DocumentsEmptyState } from "@/components/shared/DocumentsEmptyState";
import { DocumentsAddButton } from "@/components/shared/DocumentsAddButton";
import { CommonPagination } from "@/components/shared/CommonPagination";
import { useYearReportTable } from "@/hooks/use-year-report-table";
import { DocumentsDesktopList } from "@/components/documents/DocumentsDesktopList";
import { DocumentsMobileList } from "@/components/documents/DocumentsMobileList";
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
import type { Document } from "@/components/documents/DocumentsSection";

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

  const desktopDocs: Document[] = paginatedDocuments.map((doc) => ({
    id: doc.id,
    title: doc.title,
    year: doc.year,
    description: doc.description,
    fileUrl: doc.fileUrl,
    fileName: doc.fileName,
    fileSize: doc.fileSize,
    uploaderName: doc.uploaderName,
    createdAt: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : String(doc.createdAt),
  }));

  return (
    <div className="space-y-4">
      <DocumentsToolbar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Cari judul laporan..."
        sortOrder={sortOrder as SortOrder}
        onSortChange={(order) => setSortOrder(order as SortOrder)}
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
          <DocumentsDesktopList
            documents={desktopDocs}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            isAdmin={isAdmin}
            downloadingId={downloadingId}
            deletingId={deletingId}
            onDownload={handleDownload}
            onDelete={handleDelete}
          />
          <DocumentsMobileList
            documents={desktopDocs}
            isAdmin={isAdmin}
            downloadingId={downloadingId}
            deletingId={deletingId}
            onDownload={handleDownload}
            onDelete={handleDelete}
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
