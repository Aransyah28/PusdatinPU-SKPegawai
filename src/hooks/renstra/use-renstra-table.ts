"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { type SortOrder } from "@/components/shared/DocumentsToolbar";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { RenstraDocumentRow } from "@/lib/renstra/renstra-queries";
import type { Document } from "@/components/documents/DocumentsSection";

export function useRenstraTable(folderSlug: string, itemsPerPage = 10) {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("date-desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);

  const { data: documents = [], isLoading, isError } = useQuery({
    queryKey: ["renstra-documents", folderSlug],
    queryFn: async () => {
      const res = await fetch(`/api/renstra/folders/${encodeURIComponent(folderSlug)}/documents`);
      if (!res.ok) throw new Error("Gagal mengambil data dokumen");
      return res.json() as Promise<RenstraDocumentRow[]>;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (documentId: string) => {
      const res = await fetch(`/api/renstra/documents/${documentId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal menghapus dokumen");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["renstra-documents", folderSlug] });
    },
  });

  const availableYears = useMemo(() => {
    return Array.from(new Set(documents.map(d => d.year))).sort((a, b) => b - a);
  }, [documents]);

  const filteredDocuments = useMemo(() => {
    return documents
      .filter((doc) => {
        const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              doc.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesYear = selectedYear === "all" || doc.year.toString() === selectedYear;
        return matchesSearch && matchesYear;
      })
      .sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();

        if (sortOrder === "title-asc") return a.title.localeCompare(b.title);
        if (sortOrder === "title-desc") return b.title.localeCompare(a.title);
        if (sortOrder === "date-desc") return dateB - dateA;
        if (sortOrder === "date-asc") return dateA - dateB;
        return 0;
      });
  }, [documents, searchQuery, selectedYear, sortOrder]);

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

  const handleYearChange = (val: string) => {
    setSelectedYear(val);
    setCurrentPage(1);
  };

  const handleSortChange = (order: string) => {
    setSortOrder(order as SortOrder);
    setCurrentPage(1);
  };

  return {
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
  };
}
