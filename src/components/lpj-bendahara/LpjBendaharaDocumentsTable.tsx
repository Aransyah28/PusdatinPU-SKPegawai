"use client";

import { CommonPagination } from "@/components/shared/CommonPagination";
import { DocumentsToolbar } from "@/components/shared/DocumentsToolbar";
import { DocumentsEmptyState } from "@/components/shared/DocumentsEmptyState";
import { DocumentsAddButton } from "@/components/shared/DocumentsAddButton";
import { Skeleton } from "@/components/ui/skeleton";
import { DeleteConfirmDialog } from "@/components/shared/DeleteConfirmDialog";
import { DocumentsDesktopList } from "@/components/documents/DocumentsDesktopList";
import { DocumentsMobileList } from "@/components/documents/DocumentsMobileList";
import { LpjBendaharaUploadDialog } from "./LpjBendaharaUploadDialog";
import { useLpjBendaharaTable } from "@/hooks/lpj-bendahara/use-lpj-bendahara-table";

interface LpjBendaharaDocumentsTableProps {
  year: string;
  isAdmin?: boolean;
}

export function LpjBendaharaDocumentsTable({ year, isAdmin = false }: LpjBendaharaDocumentsTableProps) {
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
  } = useLpjBendaharaTable(year);

  if (isError) {
    return (
      <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-6 text-center text-destructive">
        Gagal memuat data dokumen LPJ Bendahara.
      </div>
    );
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
          emptyMessage={`Belum ada dokumen LPJ Bendahara untuk tahun ${year}.`}
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
          <LpjBendaharaUploadDialog
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
