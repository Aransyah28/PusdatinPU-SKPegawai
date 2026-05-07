"use client";

import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { type SopBidang } from "@/lib/sops/sop-types";
import { MAX_UPLOAD_FILE_SIZE, MAX_UPLOAD_FILE_SIZE_MB } from "@/lib/constants";

type BidangValue = SopBidang | "";

function formatTitleFromFileName(fileName: string) {
  const rawName = fileName.replace(/\.pdf$/i, "");
  const cleanName = rawName
    .replace(/[_\-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return cleanName.replace(/\b\w/g, (char) => char.toUpperCase());
}

interface UseSopUploadFormOptions {
  defaultYear?: number;
}

export function useSopUploadForm(
  defaultBidang: SopBidang,
  options?: UseSopUploadFormOptions,
) {
  const defaultYear = options?.defaultYear ? String(options.defaultYear) : "";
  const [title, setTitle] = useState("");
  const [year, setYear] = useState(defaultYear);
  const [bidang, setBidang] = useState<BidangValue>(defaultBidang);
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const currentYear = new Date().getFullYear();
  const years = useMemo(
    () => Array.from({ length: 10 }, (_, index) => currentYear - index),
    [currentYear],
  );

  const resetForm = () => {
    setTitle("");
    setYear(defaultYear);
    setBidang(defaultBidang);
    setDescription("");
    setFile(null);
  };

  const handleFileChange = (selectedFile: File | null) => {
    if (selectedFile && selectedFile.size > MAX_UPLOAD_FILE_SIZE) {
      toast.error(`Ukuran file tidak boleh lebih dari ${MAX_UPLOAD_FILE_SIZE_MB} MB.`);
      return;
    }

    setFile(selectedFile);

    if (!selectedFile) {
      return;
    }

    setTitle(formatTitleFromFileName(selectedFile.name));

    const yearMatch = selectedFile.name.match(/\b(20\d{2})\b/);
    if (yearMatch) {
      setYear(yearMatch[1]);
    }
  };

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!file || !title || !year || !bidang) {
        throw new Error("Data unggahan belum lengkap.");
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title);
      formData.append("year", year);
      formData.append("bidang", bidang);
      formData.append("description", description);

      const res = await fetch("/api/sops", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = (await res.json()) as { error?: string };
        throw new Error(err.error ?? "Gagal mengunggah SOP.");
      }

      return { bidang };
    },
    onSuccess: async () => {
      toast.success("SOP berhasil diunggah.");
      resetForm();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return {
    description,
    file,
    handleFileChange,
    bidang,
    bidangOptions: [
      { label: "MTI", value: "MTI" },
      { label: "BDA", value: "BDA" },
      { label: "PDBI", value: "PDBI" },
      { label: "TU", value: "TU" },
    ],
    resetForm,
    setDescription,
    setBidang,
    setTitle,
    setYear,
    title,
    uploadMutation,
    year,
    years,
  };
}
