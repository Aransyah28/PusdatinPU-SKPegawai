import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface UseDeleteRenstraFolderProps {
  onSuccessCallback?: () => void;
}

export function useDeleteRenstraFolder({ onSuccessCallback }: UseDeleteRenstraFolderProps = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (slug: string) => {
      const res = await fetch(`/api/renstra/folders/${slug}`, {
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
      queryClient.invalidateQueries({ queryKey: ["renstra-folders"] });
      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
}
