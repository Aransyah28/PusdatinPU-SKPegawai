"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { SopDocumentRow } from "@/lib/sops/sop-queries";
import type { SopBidang } from "@/lib/sops/sop-types";

export type SortOrder = "title-asc" | "title-desc" | "date-desc" | "date-asc";

export function useSopTable(bidang: SopBidang, year: number, itemsPerPage = 10) {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>("title-asc");

  const { data: documents = [], isLoading, isError } = useQuery<SopDocumentRow[]>({
    queryKey: ["sops", bidang, year],
    queryFn: async () => {
      const res = await fetch(`/api/sops?bidang=${bidang}&year=${year}`);
      if (!res.ok) throw new Error("Gagal mengambil data SOP.");
      return res.json();
    }
  });

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

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/sops/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Gagal menghapus dokumen.");
      }
    },
    onSuccess: () => {
      toast.success("Dokumen berhasil dihapus.");
      queryClient.invalidateQueries({ queryKey: ["sops", bidang, year] });
      setDeletingId(null);
      setDeleteConfirmOpen(false);
      setDocumentToDelete(null);
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

  const handleDownload = async (doc: { id: string; fileUrl: string; fileName: string }) => {
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
    queryClient.invalidateQueries({ queryKey: ["sops", bidang, year] });
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
    isLoading,
    isError,
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
