import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { rkaklDocuments } from "@/lib/db/schema";

// Type gabungan karena API juga me-return field tambahan seperti uploaderName
type ApiRkaklDocument = typeof rkaklDocuments.$inferSelect & {
  uploaderName?: string | null;
};

export function useRkaklDocuments(year: string) {
  return useQuery({
    queryKey: ["rkakl-documents", year],
    queryFn: async (): Promise<ApiRkaklDocument[]> => {
      const res = await fetch(`/api/rkakl?year=${year}`);
      if (!res.ok) throw new Error("Gagal mengambil data RKAKL.");
      return res.json();
    },
  });
}

export function useUploadRkakl() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch("/api/rkakl", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal mengunggah dokumen RKAKL.");
      }

      return res.json();
    },
    onSuccess: (_, variables) => {
      const year = variables.get("year");
      if (year) {
        queryClient.invalidateQueries({
          queryKey: ["rkakl-documents", year.toString()],
        });
      }
    },
  });
}

export function useDeleteRkakl() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/rkakl/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus dokumen RKAKL.");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rkakl-documents"] });
    },
  });
}
