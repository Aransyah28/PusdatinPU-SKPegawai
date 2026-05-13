import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { MAX_UPLOAD_FILE_SIZE, MAX_UPLOAD_FILE_SIZE_MB } from "@/lib/constants";

export function useUploadForm(onSuccessCallback?: () => void) {
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  const resetForm = () => {
    setTitle("");
    setYear("");
    setDescription("");
    setFile(null);
  };

  const handleFileChange = (selectedFile: File | null) => {
    if (selectedFile && selectedFile.size > MAX_UPLOAD_FILE_SIZE) {
      toast.error(`Ukuran file tidak boleh lebih dari ${MAX_UPLOAD_FILE_SIZE_MB} MB.`);
      return;
    }

    setFile(selectedFile);
    if (!selectedFile) return;

    const rawName = selectedFile.name.replace(/\.pdf$/i, "");
    const cleanName = rawName
      .replace(/[_\-]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const titleCased = cleanName.replace(/\b\w/g, (c) => c.toUpperCase());
    setTitle(titleCased);

    const yearMatch = rawName.match(/\b(20\d{2})\b/);
    if (yearMatch) {
      setYear(yearMatch[1]);
    } else {
      setYear("");
    }
  };

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!file || !title || !year) throw new Error("Data tidak lengkap.");

      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title);
      formData.append("year", year);
      formData.append("description", description);

      const res = await fetch("/api/documents", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json() as { error: string };
        throw new Error(err.error ?? "Gagal mengupload.");
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success("Dokumen berhasil diunggah.");
      resetForm();
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  return {
    title, setTitle,
    year, setYear,
    description, setDescription,
    file, handleFileChange,
    years,
    resetForm,
    uploadMutation
  };
}
