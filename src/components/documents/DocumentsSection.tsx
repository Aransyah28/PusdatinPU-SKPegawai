"use client";

import { ChevronDown } from "lucide-react";
import { UploadDialog } from "./UploadDialog";
import { CommonPagination } from "@/components/shared/CommonPagination";
import { DocumentsToolbar, type SortOrder } from "@/components/shared/DocumentsToolbar";
import { DocumentsEmptyState } from "@/components/shared/DocumentsEmptyState";
import { DocumentsAddButton } from "@/components/shared/DocumentsAddButton";
import { DeleteConfirmDialog } from "@/components/shared/DeleteConfirmDialog";
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
}

export function DocumentsSection({ isAdmin }: DocumentsSectionProps) {
  const {
    uploadOpen, setUploadOpen,
    deleteConfirmOpen, setDeleteConfirmOpen,
    searchQuery,
    selectedYear, setSelectedYear,
    yearDropdownOpen, setYearDropdownOpen,
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
    handleUploadSuccess,
    itemsPerPage
  } = useDocumentsSection();

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
                    setSelectedYear("all");
                    setCurrentPage(1);
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
                {uniqueYears.map((year) => {
                  const yearValue = year.toString();
                  const isSelected = selectedYear === yearValue;

                  return (
                    <button
                      key={year}
                      type="button"
                      onClick={() => {
                        setSelectedYear(yearValue);
                        setCurrentPage(1);
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
              label="Tambah SK"
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
          <UploadDialog
            open={uploadOpen}
            onOpenChange={setUploadOpen}
            onSuccess={handleUploadSuccess}
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
