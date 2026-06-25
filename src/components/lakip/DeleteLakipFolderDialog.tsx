"use client";

import { DeleteConfirmDialog } from "@/components/shared/DeleteConfirmDialog";
import type { LakipFolderSummary } from "@/lib/lakip/lakip-types";
import { useDeleteLakipFolder } from "@/hooks/lakip/use-delete-lakip-folder";

interface DeleteLakipFolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folderToDelete: LakipFolderSummary | null;
}

export function DeleteLakipFolderDialog({ open, onOpenChange, folderToDelete }: DeleteLakipFolderDialogProps) {
  const deleteMutation = useDeleteLakipFolder({
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
      title="Hapus Folder LAKIP"
      documentLabel={`folder "${folderToDelete?.name}" beserta seluruh isinya`}
      isPending={deleteMutation.isPending}
    />
  );
}
