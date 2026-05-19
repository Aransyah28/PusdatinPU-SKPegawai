"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { type SortOrder } from "@/components/shared/DocumentsToolbar";
import { useLaporanKeuanganDocuments, useDeleteLaporanKeuangan } from "./use-laporan-keuangan-documents";
import type { Document } from "@/components/documents/DocumentsSection";

export function useLaporanKeuanganTable(year: string, itemsPerPage = 10) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("date-desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);

  const { data: documents = [], isLoading, isError } = useLaporanKeuanganDocuments(year);
  const deleteMutation = useDeleteLaporanKeuangan();

  const filteredDocuments = useMemo(() => {
    return documents
      .filter((doc) => doc.title.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();

        if (sortOrder === "title-asc") return a.title.localeCompare(b.title);
        if (sortOrder === "title-desc") return b.title.localeCompare(a.title);
        if (sortOrder === "date-desc") return dateB - dateA;
        if (sortOrder === "date-asc") return dateA - dateB;
        return 0;
      });
  }, [documents, searchQuery, sortOrder]);

  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage) || 1;

  const paginatedDocuments = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredDocuments.slice(start, start + itemsPerPage);
  }, [filteredDocuments, currentPage, itemsPerPage]);

  const genericDocs: Document[] = useMemo(() => {
    return paginatedDocuments.map(doc => ({
      id: doc.id,
      title: doc.title,
      year: doc.year,
      description: doc.description,
      fileUrl: doc.fileUrl,
      fileName: doc.fileName,
      fileSize: doc.fileSize,
      uploaderName: doc.uploaderName ?? doc.uploadedBy,
      createdAt: new Date(doc.createdAt).toISOString(),
    }));
  }, [paginatedDocuments]);

  const handleDeleteClick = (id: string) => {
    setDocumentToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (documentToDelete) {
      setDeletingId(documentToDelete);
      deleteMutation.mutate(documentToDelete, {
        onSuccess: () => {
          toast.success("Dokumen berhasil dihapus.");
          setDeletingId(null);
          setDeleteConfirmOpen(false);
          setDocumentToDelete(null);
        },
        onError: (error) => {
          toast.error(error.message || "Gagal menghapus dokumen.");
          setDeletingId(null);
          setDeleteConfirmOpen(false);
          setDocumentToDelete(null);
        }
      });
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmOpen(false);
    setDocumentToDelete(null);
  };

  const handleDownload = async (doc: { id: string; fileUrl: string; fileName: string }) => {
    setDownloadingId(doc.id);
    try {
      const res = await fetch(doc.fileUrl);
      if (!res.ok) throw new Error("Gagal mengunduh file");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = doc.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Gagal mengunduh file.");
    } finally {
      setDownloadingId(null);
    }
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleSortChange = (order: string) => {
    setSortOrder(order as SortOrder);
    setCurrentPage(1);
  };

  return {
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
  };
}
