"use client";

import { CommonPagination } from "@/components/shared/CommonPagination";
import { DocumentsToolbar } from "@/components/shared/DocumentsToolbar";
import { DocumentsEmptyState } from "@/components/shared/DocumentsEmptyState";
import { DocumentsAddButton } from "@/components/shared/DocumentsAddButton";
import { TableErrorState } from "@/components/shared/TableErrorState";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import { DeleteConfirmDialog } from "@/components/shared/DeleteConfirmDialog";
import { DocumentsDesktopList } from "@/components/documents/DocumentsDesktopList";
import { DocumentsMobileList } from "@/components/documents/DocumentsMobileList";
import { LaporanKeuanganUploadDialog } from "./LaporanKeuanganUploadDialog";
import { useLaporanKeuanganTable } from "@/hooks/laporan-keuangan/use-laporan-keuangan-table";

interface LaporanKeuanganDocumentsTableProps {
  year: string;
  isAdmin?: boolean;
}

export function LaporanKeuanganDocumentsTable({ year, isAdmin = false }: LaporanKeuanganDocumentsTableProps) {
  const {
    searchQuery,
    sortOrder,
    currentPage,
    uploadOpen,
    deletingId,
    downloadingId,
    deleteConfirmOpen,
    isLoading,
    isError,
    filteredDocuments,
    genericDocs,
    totalPages,
    setUploadOpen,
    setCurrentPage,
    handleSearchChange,
    handleSortChange,
    handleDeleteClick,
    confirmDelete,
    cancelDelete,
    handleDownload,
    setDeleteConfirmOpen,
  } = useLaporanKeuanganTable(year);

  if (isError) {
    return <TableErrorState message="Gagal memuat data dokumen Laporan Keuangan." />;
  }

  return (
    <div className="space-y-4">
      <DocumentsToolbar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Cari judul dokumen..."
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
        actionButton={
          isAdmin ? (
            <DocumentsAddButton
              onClick={() => setUploadOpen(true)}
              label="Tambah Dokumen"
            />
          ) : undefined
        }
      />

      {isLoading ? (
        <TableSkeleton />
      ) : filteredDocuments.length === 0 ? (
        <DocumentsEmptyState
          searchQuery={searchQuery}
          emptyMessage={`Belum ada dokumen Laporan Keuangan untuk tahun ${year}.`}
        />
      ) : (
        <div className="space-y-4">
          <DocumentsDesktopList
            documents={genericDocs}
            currentPage={currentPage}
            itemsPerPage={10}
            isAdmin={isAdmin}
            downloadingId={downloadingId}
            deletingId={deletingId}
            onDownload={handleDownload}
            onDelete={handleDeleteClick}
          />
          <DocumentsMobileList
            documents={genericDocs}
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
          <LaporanKeuanganUploadDialog
            open={uploadOpen}
            onOpenChange={setUploadOpen}
            defaultYear={year}
          />

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
