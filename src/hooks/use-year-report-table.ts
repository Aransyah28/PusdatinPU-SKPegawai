"use client";

import { useState, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { ReportDocumentRow } from "@/lib/reports/report-queries";

export type SortOrder = "title-asc" | "title-desc" | "date-desc" | "date-asc";

export function useYearReportTable(documents: ReportDocumentRow[], itemsPerPage = 10) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>("title-asc");

  const filteredDocuments = useMemo(() => {
    return documents
      .filter((doc) => doc.title.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => {
        if (sortOrder === "title-asc") return a.title.localeCompare(b.title);
        if (sortOrder === "title-desc") return b.title.localeCompare(a.title);
        if (sortOrder === "date-desc") return b.createdAt.getTime() - a.createdAt.getTime();
        if (sortOrder === "date-asc") return a.createdAt.getTime() - b.createdAt.getTime();
        return 0;
      });
  }, [documents, searchQuery, sortOrder]);

  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);
  
  const paginatedDocuments = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredDocuments.slice(start, start + itemsPerPage);
  }, [filteredDocuments, currentPage, itemsPerPage]);

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/documents/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Gagal menghapus dokumen.");
      }
    },
    onSuccess: () => {
      toast.success("Dokumen berhasil dihapus.");
      setDeletingId(null);
      setDeleteConfirmOpen(false);
      setDocumentToDelete(null);
      router.refresh(); // Fetch new server side data
    },
    onError: (error) => {
      toast.error(error.message || "Gagal menghapus dokumen.");
      setDeletingId(null);
      setDeleteConfirmOpen(false);
      setDocumentToDelete(null);
    },
  });

  const handleDeleteClick = (id: string) => {
    setDocumentToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (documentToDelete) {
      setDeletingId(documentToDelete);
      deleteMutation.mutate(documentToDelete);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmOpen(false);
    setDocumentToDelete(null);
  };

  const handleDownload = async (doc: ReportDocumentRow) => {
    setDownloadingId(doc.id);
    try {
      const res = await fetch(doc.fileUrl);
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

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleUploadSuccess = () => {
    router.refresh();
  };

  return {
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
    handleDelete: handleDeleteClick,
    confirmDelete,
    cancelDelete,
    deleteConfirmOpen,
    setDeleteConfirmOpen,
    handleDownload,
    handleUploadSuccess,
    itemsPerPage,
    sortOrder,
    setSortOrder
  };
}
