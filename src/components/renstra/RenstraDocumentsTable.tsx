"use client";

import { ChevronDown } from "lucide-react";
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
    yearDropdownOpen,
    isLoading,
    isError,
    filteredDocuments,
    genericDocs,
    totalPages,
    setUploadOpen,
    setCurrentPage,
    setYearDropdownOpen,
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
        extraFilters={
          <div className="relative">
            <button
              type="button"
              onClick={() => setYearDropdownOpen((open) => !open)}
              className="flex h-9 min-w-[132px] items-center justify-between gap-2.5 rounded-full border border-border bg-card/95 px-3 text-left text-sm font-medium text-foreground shadow-[0_1px_0_0_rgba(0,0,0,0.02),0_6px_14px_rgba(24,44,106,0.05)] transition-all duration-150 hover:border-border hover:shadow-[0_1px_0_0_rgba(0,0,0,0.02),0_8px_16px_rgba(24,44,106,0.07)] focus:outline-none focus:ring-2 focus:ring-primary/10"
              aria-haspopup="listbox"
              aria-expanded={yearDropdownOpen}
            >
              <span className="truncate">
                {selectedYear === "all" ? "Semua Tahun" : `Tahun ${selectedYear}`}
              </span>
              <ChevronDown
                className={`h-3.5 w-3.5 shrink-0 text-body/35 transition-transform duration-150 ${
                  yearDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {yearDropdownOpen && (
              <div className="absolute right-0 sm:left-0 top-full z-20 mt-2 min-w-[132px] overflow-hidden rounded-2xl border border-border bg-white p-1 shadow-[0_14px_24px_rgba(24,44,106,0.1)]">
                <button
                  type="button"
                  onClick={() => {
                    handleYearChange("all");
                    setYearDropdownOpen(false);
                  }}
                  className={`flex w-full items-center rounded-xl px-3 py-2 text-left text-sm transition-colors duration-150 hover:bg-muted/50 ${
                    selectedYear === "all" ? "bg-primary text-white hover:bg-primary" : "text-foreground"
                  }`}
                  role="option"
                  aria-selected={selectedYear === "all"}
                >
                  Semua Tahun
                </button>
                {availableYears.map((year) => {
                  const yearValue = year.toString();
                  const isSelected = selectedYear === yearValue;
                  return (
                    <button
                      key={year}
                      type="button"
                      onClick={() => {
                        handleYearChange(yearValue);
                        setYearDropdownOpen(false);
                      }}
                      className={`flex w-full items-center rounded-xl px-3 py-2 text-left text-sm transition-colors duration-150 hover:bg-muted/50 ${
                        isSelected ? "bg-primary text-white hover:bg-primary" : "text-foreground"
                      }`}
                      role="option"
                      aria-selected={isSelected}
                    >
                      Tahun {year}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        }
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
