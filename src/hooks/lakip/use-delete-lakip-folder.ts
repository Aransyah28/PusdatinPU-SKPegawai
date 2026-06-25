import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface UseDeleteLakipFolderProps {
  onSuccessCallback?: () => void;
}

export function useDeleteLakipFolder({ onSuccessCallback }: UseDeleteLakipFolderProps = {}) {
  const queryClient = useQueryClient();

  return useMutation({
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
      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
}
