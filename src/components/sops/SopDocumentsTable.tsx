"use client";

import { useState, useEffect, useRef } from "react";
import { Search, ChevronDown, FileText, Plus } from "lucide-react";
import { CommonPagination } from "@/components/shared/CommonPagination";
import { SopUploadDialog } from "./SopUploadDialog";
import { useSopTable } from "@/hooks/use-sop-table";
import { DocumentsDesktopList } from "@/components/documents/DocumentsDesktopList";
import { DocumentsMobileList } from "@/components/documents/DocumentsMobileList";
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

import type { SopDocumentRow } from "@/lib/sops/sop-queries";
import type { SopBidang } from "@/lib/sops/sop-types";
import type { Document } from "@/components/documents/DocumentsSection";

interface SopDocumentsTableProps {
  documents: SopDocumentRow[];
  isAdmin?: boolean;
  bidang: SopBidang;
  year: number;
}

export function SopDocumentsTable({ 
  documents, 
  isAdmin = false,
  bidang,
  year 
}: SopDocumentsTableProps) {
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(event.target as Node)
      ) {
        setSortDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
  } = useSopTable(documents, 10);

  // Cast SopDocumentRow to Document for the generic list components
  const desktopDocs = paginatedDocuments as unknown as Document[];

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-body/40" />
            <input
              type="text"
              placeholder="Cari judul SOP..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="h-9 w-full rounded-full border border-border bg-white pl-10 pr-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>
          <div className="relative" ref={sortDropdownRef}>
            <button
              type="button"
              onClick={() => setSortDropdownOpen((open) => !open)}
              className="flex h-9 min-w-[120px] items-center justify-between gap-2.5 rounded-full border border-[#ececec] bg-white/95 px-3 text-left text-sm font-medium text-foreground shadow-[0_1px_0_0_rgba(0,0,0,0.02),0_6px_14px_rgba(24,44,106,0.05)] transition-all duration-150 hover:border-[#e6e6e6] hover:shadow-[0_1px_0_0_rgba(0,0,0,0.02),0_8px_16px_rgba(24,44,106,0.07)] focus:outline-none focus:ring-2 focus:ring-primary/10"
              aria-haspopup="listbox"
              aria-expanded={sortDropdownOpen}
            >
              <span className="truncate">
                {sortOrder === "title-asc" && "A - Z"}
                {sortOrder === "title-desc" && "Z - A"}
                {sortOrder === "date-desc" && "Terbaru"}
                {sortOrder === "date-asc" && "Terlama"}
              </span>
              <ChevronDown
                className={`h-3.5 w-3.5 shrink-0 text-body/35 transition-transform duration-150 ${
                  sortDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {sortDropdownOpen && (
              <div className="absolute right-0 top-full z-20 mt-2 min-w-full overflow-hidden rounded-2xl border border-[#ececec] bg-white p-1 shadow-[0_14px_24px_rgba(24,44,106,0.1)]">
                {[
                  { value: "title-asc", label: "A - Z" },
                  { value: "title-desc", label: "Z - A" },
                  { value: "date-desc", label: "Terbaru" },
                  { value: "date-asc", label: "Terlama" },
                ].map((option) => {
                  const isSelected = sortOrder === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setSortOrder(option.value as any);
                        setSortDropdownOpen(false);
                      }}
                      className={`flex w-full items-center rounded-xl px-3 py-2 text-left text-sm transition-colors duration-150 hover:bg-[#f5f8ff] ${
                        isSelected ? "bg-primary text-white hover:bg-primary" : "text-foreground"
                      }`}
                      role="option"
                      aria-selected={isSelected}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {isAdmin && (
          <button
            onClick={() => setUploadOpen(true)}
            className="group inline-flex h-12 min-w-[168px] items-center justify-center gap-2 rounded-[18px] bg-primary px-6 text-[15px] font-black tracking-tight text-white shadow-[0_5px_0_0_#ffd602,0_12px_24px_rgba(24,44,106,0.18)] transition-all duration-150 hover:-translate-y-[1px] hover:shadow-[0_7px_0_0_#ffd602,0_14px_28px_rgba(24,44,106,0.2)] active:translate-y-[2px] active:shadow-[0_4px_0_0_#ffd602,0_8px_16px_rgba(24,44,106,0.14)]"
          >
            <Plus className="h-4 w-4 text-[#ffd602] transition-transform duration-150 group-hover:scale-105" />
            Tambah SOP
          </button>
        )}
      </div>

      {/* Content */}
      {filteredDocuments.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border py-14 text-center">
          <div className="mb-3 rounded-full bg-muted p-3">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-title-md font-semibold text-heading">Belum ada dokumen</p>
          <p className="mt-1 max-w-xs text-sm text-body/70">
            {searchQuery 
              ? `Tidak ditemukan dokumen untuk kata kunci "${searchQuery}"`
              : "SOP untuk tahun ini belum tersedia."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <DocumentsDesktopList
            documents={desktopDocs}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            isAdmin={isAdmin}
            downloadingId={downloadingId}
            deletingId={deletingId}
            onDownload={handleDownload as any}
            onDelete={handleDelete}
          />
          <DocumentsMobileList
            documents={desktopDocs}
            isAdmin={isAdmin}
            downloadingId={downloadingId}
            deletingId={deletingId}
            onDownload={handleDownload as any}
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
          
          <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Hapus Dokumen</AlertDialogTitle>
                <AlertDialogDescription>
                  Apakah Anda yakin ingin menghapus SOP ini? Tindakan ini tidak dapat dibatalkan dan file akan dihapus secara permanen.
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
