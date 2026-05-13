"use client";

import { CommonPagination } from "@/components/shared/CommonPagination";
import { DocumentsToolbar } from "@/components/shared/DocumentsToolbar";
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
import { DocumentsDesktopList } from "@/components/documents/DocumentsDesktopList";
import { DocumentsMobileList } from "@/components/documents/DocumentsMobileList";
import { RkaklUploadDialog } from "./RkaklUploadDialog";
import { useRkaklTable } from "@/hooks/rkakl/use-rkakl-table";

interface RkaklDocumentsTableProps {
  year: string;
  isAdmin?: boolean;
}

export function RkaklDocumentsTable({ year, isAdmin = false }: RkaklDocumentsTableProps) {
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
  } = useRkaklTable(year);

  if (isError) {
    return (
      <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-6 text-center text-destructive">
        Gagal memuat data dokumen RKAKL.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <DocumentsToolbar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Cari judul dokumen RKAKL..."
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
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-[72px] w-full rounded-xl" />
          ))}
        </div>
      ) : filteredDocuments.length === 0 ? (
        <DocumentsEmptyState
          searchQuery={searchQuery}
          emptyMessage={`Belum ada dokumen RKAKL untuk tahun ${year}.`}
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
          <RkaklUploadDialog
            open={uploadOpen}
            onOpenChange={setUploadOpen}
            defaultYear={year}
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

