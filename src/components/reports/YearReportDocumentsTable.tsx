"use client";

import { ReportUploadDialog } from "./ReportUploadDialog";
import { DocumentsToolbar, type SortOrder } from "@/components/shared/DocumentsToolbar";
import { DocumentsEmptyState } from "@/components/shared/DocumentsEmptyState";
import { DocumentsAddButton } from "@/components/shared/DocumentsAddButton";
import { CommonPagination } from "@/components/shared/CommonPagination";
import { useYearReportTable } from "@/hooks/use-year-report-table";
import { DocumentsDesktopList } from "@/components/documents/DocumentsDesktopList";
import { DocumentsMobileList } from "@/components/documents/DocumentsMobileList";
import { DeleteConfirmDialog } from "@/components/shared/DeleteConfirmDialog";
import { TableErrorState } from "@/components/shared/TableErrorState";
import { TableSkeleton } from "@/components/shared/TableSkeleton";

import type { ReportType } from "@/lib/reports/report-types";
import type { Document } from "@/components/documents/DocumentsSection";

interface YearReportDocumentsTableProps {
  isAdmin?: boolean;
  reportType: ReportType;
  year: number;
}

export function YearReportDocumentsTable({ 
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
    isLoading,
    isError,
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
  } = useYearReportTable(reportType, year, 10);

  if (isError) {
    return <TableErrorState message="Gagal memuat data laporan. Silakan muat ulang halaman." />;
  }

  const desktopDocs: Document[] = paginatedDocuments.map((doc) => ({
    id: doc.id,
    title: doc.title,
    year: doc.year,
    description: doc.description,
    fileUrl: doc.fileUrl,
    fileName: doc.fileName,
    fileSize: doc.fileSize,
    uploaderName: doc.uploaderName,
    createdAt: doc.createdAt ? (doc.createdAt instanceof Date ? doc.createdAt.toISOString() : String(doc.createdAt)) : "",
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
      {isLoading ? (
        <TableSkeleton />
      ) : filteredDocuments.length === 0 ? (
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
          
          <DeleteConfirmDialog
            open={deleteConfirmOpen}
            onOpenChange={setDeleteConfirmOpen}
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
            documentLabel="laporan"
          />
        </>
      )}
    </div>
  );
}
