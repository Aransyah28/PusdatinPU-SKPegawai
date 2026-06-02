import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useRenstraUploadForm(folderSlug: string) {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const resetForm = () => {
    setTitle("");
    setYear("");
    setDescription("");
    setFile(null);
  };

  const handleFileChange = (newFile: File | null) => {
    setFile(newFile);
    if (newFile && !title) {
      // Hilangkan ekstensi .pdf untuk auto-fill judul
      const fileNameWithoutExt = newFile.name.replace(/\.[^/.]+$/, "");
      setTitle(fileNameWithoutExt);
    }
  };

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch(`/api/renstra/folders/${folderSlug}/documents`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal mengunggah dokumen");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["renstra-documents", folderSlug] });
    },
  });

  return {
    title, setTitle,
    year, setYear,
    description, setDescription,
    file, handleFileChange,
    resetForm,
    uploadMutation,
  };
}
