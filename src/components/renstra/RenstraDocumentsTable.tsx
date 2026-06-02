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
import { RenstraUploadDialog } from "./RenstraUploadDialog";
import { useRenstraTable } from "@/hooks/renstra/use-renstra-table";
import { FormSelectField } from "@/components/shared/FormSelectField";

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

  const yearOptions = [
    { value: "all", label: "Semua Tahun" },
    ...availableYears.map(y => ({ value: String(y), label: String(y) }))
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 min-w-0">
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
        </div>
        <div className="w-full sm:w-48">
          <FormSelectField
            label="Filter Tahun"
            value={selectedYear}
            onChange={(e) => handleYearChange(e.target.value)}
            options={yearOptions}
            placeholder="Filter Tahun"
          />
        </div>
      </div>

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
