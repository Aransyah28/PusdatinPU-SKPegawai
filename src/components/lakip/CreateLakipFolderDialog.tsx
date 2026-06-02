"use client";

import { useState } from "react";
import { toast } from "sonner";
import { BaseUploadDialog } from "@/components/shared/BaseUploadDialog";
import { FormTextField } from "@/components/shared/FormTextField";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface CreateLakipFolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateLakipFolderDialog({ open, onOpenChange }: CreateLakipFolderDialogProps) {
  const [name, setName] = useState("");
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (folderName: string) => {
      const res = await fetch("/api/lakip/folders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: folderName }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal membuat folder");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Folder berhasil dibuat.");
      queryClient.invalidateQueries({ queryKey: ["lakip-folders"] });
      setName("");
      onOpenChange(false);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const handleSubmit = () => {
    if (!name.trim()) {
      toast.error("Nama folder tidak boleh kosong.");
      return;
    }
    createMutation.mutate(name.trim());
  };

  const handleCancel = () => {
    setName("");
  };

  return (
    <BaseUploadDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Tambah Folder Baru"
      description="Buat folder baru untuk mengelompokkan dokumen LAKIP."
      onSave={handleSubmit}
      onCancel={handleCancel}
      isPending={createMutation.isPending}
      saveDisabled={!name.trim()}
      saveLabel="Buat Folder"
    >
      <FormTextField
        label="Nama Folder"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Contoh: LAKIP 2024"
      />
    </BaseUploadDialog>
  );
}
