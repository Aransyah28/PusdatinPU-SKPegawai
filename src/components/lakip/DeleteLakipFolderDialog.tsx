"use client";

import { toast } from "sonner";
import { DeleteConfirmDialog } from "@/components/shared/DeleteConfirmDialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { LakipFolderSummary } from "@/lib/lakip/lakip-types";

interface DeleteLakipFolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folderToDelete: LakipFolderSummary | null;
}

export function DeleteLakipFolderDialog({ open, onOpenChange, folderToDelete }: DeleteLakipFolderDialogProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (slug: string) => {
      const res = await fetch(`/api/lakip/folders/${slug}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal menghapus folder");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Folder berhasil dihapus.");
      queryClient.invalidateQueries({ queryKey: ["lakip-folders"] });
      onOpenChange(false);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const handleConfirm = () => {
    if (!folderToDelete) return;
    deleteMutation.mutate(folderToDelete.slug);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <DeleteConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
      title="Hapus Folder LAKIP"
      documentLabel={`folder "${folderToDelete?.name}" beserta seluruh isinya`}
      isPending={deleteMutation.isPending}
    />
  );
}
