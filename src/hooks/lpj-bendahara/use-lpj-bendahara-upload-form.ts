import { useState } from "react";
import { toast } from "sonner";
import { useUploadLpjBendahara } from "@/hooks/lpj-bendahara/use-lpj-bendahara-documents";
import { MAX_UPLOAD_FILE_SIZE, MAX_UPLOAD_FILE_SIZE_MB } from "@/lib/constants";

const CURRENT_YEAR = new Date().getFullYear();
const AVAILABLE_YEARS = Array.from({ length: 10 }, (_, i) => CURRENT_YEAR + 2 - i);

export function useLpjBendaharaUploadForm(defaultYear?: string) {
  const [title, setTitle] = useState("");
  const [year, setYear] = useState(defaultYear || "");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const uploadMutation = useUploadLpjBendahara();

  const resetForm = () => {
    setTitle("");
    setYear(defaultYear || "");
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

    if (!defaultYear) {
      const yearMatch = rawName.match(/\b(20\d{2})\b/);
      if (yearMatch) {
        setYear(yearMatch[1]);
      } else {
        setYear("");
      }
    }
  };

  return {
    title, setTitle,
    year, setYear,
    description, setDescription,
    file, handleFileChange,
    years: AVAILABLE_YEARS,
    resetForm,
    uploadMutation
  };
}
