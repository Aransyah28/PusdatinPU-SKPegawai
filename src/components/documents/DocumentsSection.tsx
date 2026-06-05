"use client";

import { CommonPagination } from "@/components/shared/CommonPagination";
import { DocumentsToolbar, type SortOrder } from "@/components/shared/DocumentsToolbar";
import { DocumentsEmptyState } from "@/components/shared/DocumentsEmptyState";
import { DeleteConfirmDialog } from "@/components/shared/DeleteConfirmDialog";
import { SKPegawaiUploadAction } from "@/components/documents/SKPegawaiUploadAction";
import { TableErrorState } from "@/components/shared/TableErrorState";
import { DocumentsDesktopList } from "./DocumentsDesktopList";
import { DocumentsMobileList } from "./DocumentsMobileList";
import { useDocumentsSection } from "@/hooks/documents/use-documents-section";
import { TableSkeleton } from "@/components/shared/TableSkeleton";

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
  year?: string;
}

export function DocumentsSection({ isAdmin, year }: DocumentsSectionProps) {
  const {
    deleteConfirmOpen, setDeleteConfirmOpen,
    searchQuery,
    selectedYear, setSelectedYear,
    sortOrder, setSortOrder,
    currentPage, setCurrentPage,
    isLoading, isError,
    uniqueYears,
    filteredDocuments,
    paginatedDocuments,
    totalPages,
    downloadingId,
    deletingId,
    handleDelete,
    confirmDelete,
    cancelDelete,
    handleDownload,
    handleSearchChange,
    itemsPerPage
  } = useDocumentsSection(10, year);

  if (isError) {
    return <TableErrorState message="Gagal memuat data. Silakan muat ulang halaman." />;
  }

  return (
    <div className="space-y-4">
      <DocumentsToolbar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Cari nama SK..."
        sortOrder={sortOrder as SortOrder}
        onSortChange={(order) => setSortOrder(order as SortOrder)}
        showYearFilter={!year}
        selectedYear={selectedYear}
        availableYears={uniqueYears}
        onYearChange={(year) => {
          setSelectedYear(year);
          setCurrentPage(1);
        }}
        actionButton={isAdmin ? <SKPegawaiUploadAction /> : undefined}
      />

      {/* Content */}
      {isLoading ? (
        <TableSkeleton />
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
            onDelete={handleDelete}
          />

          <DocumentsMobileList
            documents={paginatedDocuments}
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
          <DeleteConfirmDialog
            open={deleteConfirmOpen}
            onOpenChange={setDeleteConfirmOpen}
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
          />
        </>
      )}
    </div>
  );
}
