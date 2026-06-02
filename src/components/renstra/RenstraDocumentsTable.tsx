"use client";

import { CommonPagination } from "@/components/shared/CommonPagination";
import { DocumentsToolbar } from "@/components/shared/DocumentsToolbar";
import { DocumentsEmptyState } from "@/components/shared/DocumentsEmptyState";
import { DocumentsAddButton } from "@/components/shared/DocumentsAddButton";
import { TableErrorState } from "@/components/shared/TableErrorState";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import { DeleteConfirmDialog } from "@/components/shared/DeleteConfirmDialog";
import { DocumentsMobileList } from "@/components/documents/DocumentsMobileList";
import { DocumentsDesktopList } from "@/components/documents/DocumentsDesktopList";
import { RenstraUploadDialog } from "./RenstraUploadDialog";
import { useRenstraTable } from "@/hooks/renstra/use-renstra-table";

interface RenstraDocumentsTableProps {
  folderSlug: string;
  folderName: string;
  isAdmin?: boolean;
}

export function RenstraDocumentsTable({ folderSlug, folderName, isAdmin = false }: RenstraDocumentsTableProps) {
  const {
    searchQuery,
    selectedYear,
    availableYears,
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
    handleYearChange,
    handleSortChange,
    handleDeleteClick,
    confirmDelete,
    cancelDelete,
    handleDownload,
    setDeleteConfirmOpen,
  } = useRenstraTable(folderSlug);

  if (isError) {
    return <TableErrorState message="Gagal memuat data dokumen Renstra." />;
  }

  return (
    <div className="space-y-4">
      <DocumentsToolbar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Cari judul dokumen..."
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
        showYearFilter={true}
        selectedYear={selectedYear}
        availableYears={availableYears}
        onYearChange={handleYearChange}
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
          emptyMessage={`Belum ada dokumen Renstra untuk folder ${folderName}.`}
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
          <RenstraUploadDialog
            open={uploadOpen}
            onOpenChange={setUploadOpen}
            folderSlug={folderSlug}
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
