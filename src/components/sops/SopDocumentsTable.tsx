"use client";

import { useState, useEffect, useRef } from "react";
import { CommonPagination } from "@/components/shared/CommonPagination";
import { SopUploadDialog } from "./SopUploadDialog";
import { useSopTable } from "@/hooks/use-sop-table";
import { DocumentsDesktopList } from "@/components/documents/DocumentsDesktopList";
import { DocumentsMobileList } from "@/components/documents/DocumentsMobileList";
import { DocumentsToolbar, type SortOrder } from "@/components/shared/DocumentsToolbar";
import { DocumentsEmptyState } from "@/components/shared/DocumentsEmptyState";
import { DocumentsAddButton } from "@/components/shared/DocumentsAddButton";
import { DeleteConfirmDialog } from "@/components/shared/DeleteConfirmDialog";
import { Skeleton } from "@/components/ui/skeleton";

import type { SopBidang } from "@/lib/sops/sop-types";
import type { Document } from "@/components/documents/DocumentsSection";

interface SopDocumentsTableProps {
  isAdmin?: boolean;
  bidang: SopBidang;
  year: number;
}

export function SopDocumentsTable({ 
  isAdmin = false,
  bidang,
  year 
}: SopDocumentsTableProps) {

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
  } = useSopTable(bidang, year, 10);

  if (isError) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center">
        <p className="text-label-lg text-destructive">
          Gagal memuat data SOP. Silakan muat ulang halaman.
        </p>
      </div>
    );
  }

  // Map SopDocumentRow to Document for the generic list components
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
        searchPlaceholder="Cari judul SOP..."
        sortOrder={sortOrder as SortOrder}
        onSortChange={(order) => setSortOrder(order as SortOrder)}
        actionButton={
          isAdmin ? (
            <DocumentsAddButton
              onClick={() => setUploadOpen(true)}
              label="Tambah SOP"
            />
          ) : undefined
        }
      />

      {/* Content */}
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
          emptyMessage="SOP untuk tahun ini belum tersedia."
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
          <SopUploadDialog
            open={uploadOpen}
            onOpenChange={setUploadOpen}
            defaultBidang={bidang}
            defaultYear={year}
            onSuccess={handleUploadSuccess}
          />
          
          <DeleteConfirmDialog
            open={deleteConfirmOpen}
            onOpenChange={setDeleteConfirmOpen}
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
            documentLabel="SOP"
          />
        </>
      )}
    </div>
  );
}
