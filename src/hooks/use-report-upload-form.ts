"use client";

import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { reportTypeMap, type ReportType } from "@/lib/reports/report-types";
import { MAX_UPLOAD_FILE_SIZE, MAX_UPLOAD_FILE_SIZE_MB } from "@/lib/constants";

type ReportTypeValue = ReportType | "";

const reportTypeKeywords: Array<{ reportType: ReportType; keywords: string[] }> = [
  { reportType: "kinerja", keywords: ["kinerja"] },
  { reportType: "bulanan", keywords: ["bulanan"] },
  { reportType: "triwulan", keywords: ["triwulan"] },
  { reportType: "mingguan", keywords: ["mingguan"] },
];

function detectReportType(fileName: string): ReportTypeValue {
  const normalized = fileName.toLowerCase();

  for (const item of reportTypeKeywords) {
    if (item.keywords.some((keyword) => normalized.includes(keyword))) {
      return item.reportType;
    }
  }

  return "";
}

function formatTitleFromFileName(fileName: string) {
  const rawName = fileName.replace(/\.pdf$/i, "");
  const cleanName = rawName
    .replace(/[_\-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return cleanName.replace(/\b\w/g, (char) => char.toUpperCase());
}

interface UseReportUploadFormOptions {
  defaultYear?: number;
}

export function useReportUploadForm(
  defaultReportType: ReportType,
  options?: UseReportUploadFormOptions,
) {
  const queryClient = useQueryClient();
  const defaultYear = options?.defaultYear ? String(options.defaultYear) : "";
  const [title, setTitle] = useState("");
  const [year, setYear] = useState(defaultYear);
  const [reportType, setReportType] = useState<ReportTypeValue>(defaultReportType);
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
    setReportType(defaultReportType);
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

    const detectedReportType = detectReportType(selectedFile.name);
    if (detectedReportType) {
      setReportType(detectedReportType);
    }

    const yearMatch = selectedFile.name.match(/\b(20\d{2})\b/);
    if (yearMatch) {
      setYear(yearMatch[1]);
    }
  };

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!file || !title || !year || !reportType) {
        throw new Error("Data unggahan belum lengkap.");
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title);
      formData.append("year", year);
      formData.append("reportType", reportType);
      formData.append("description", description);

      const res = await fetch("/api/reports", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = (await res.json()) as { error?: string };
        throw new Error(err.error ?? "Gagal mengunggah laporan.");
      }

      return { reportType };
    },
    onSuccess: async () => {
      toast.success("Laporan berhasil diunggah.");
      await queryClient.invalidateQueries({ queryKey: ["available-years"] });
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
    reportType,
    reportTypeOptions: Object.entries(reportTypeMap).map(([value, config]) => ({
      label: config.title,
      value: value as ReportType,
    })),
    resetForm,
    setDescription,
    setReportType,
    setTitle,
    setYear,
    title,
    uploadMutation,
    year,
    years,
  };
}