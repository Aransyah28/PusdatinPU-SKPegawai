"use client";

import { DeleteConfirmDialog } from "@/components/shared/DeleteConfirmDialog";
import type { RenstraFolderSummary } from "@/lib/renstra/renstra-types";
import { useDeleteRenstraFolder } from "@/hooks/renstra/use-delete-renstra-folder";

interface DeleteFolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folderToDelete: RenstraFolderSummary | null;
}

export function DeleteFolderDialog({ open, onOpenChange, folderToDelete }: DeleteFolderDialogProps) {
  const deleteMutation = useDeleteRenstraFolder({
    onSuccessCallback: () => onOpenChange(false),
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
      title="Hapus Folder"
      documentLabel={`folder "${folderToDelete?.name}" beserta seluruh isinya`}
      isPending={deleteMutation.isPending}
    />
  );
}
