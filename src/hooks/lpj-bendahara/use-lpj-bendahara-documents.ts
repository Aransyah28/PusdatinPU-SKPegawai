import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { lpjBendaharaDocuments } from "@/lib/db/schema";

// Type gabungan karena API juga me-return field tambahan seperti uploaderName
type ApiLpjBendaharaDocument = typeof lpjBendaharaDocuments.$inferSelect & {
  uploaderName?: string | null;
};

export function useLpjBendaharaDocuments(year: string) {
  return useQuery({
    queryKey: ["lpj-bendahara-documents", year],
    queryFn: async (): Promise<ApiLpjBendaharaDocument[]> => {
      const res = await fetch(`/api/lpj-bendahara?year=${year}`);
      if (!res.ok) throw new Error("Gagal mengambil data LPJ Bendahara.");
      return res.json();
    },
  });
}

export function useUploadLpjBendahara() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch("/api/lpj-bendahara", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal mengunggah dokumen LPJ Bendahara.");
      }

      return res.json();
    },
    onSuccess: (_, variables) => {
      const year = variables.get("year");
      if (year) {
        queryClient.invalidateQueries({
          queryKey: ["lpj-bendahara-documents", year.toString()],
        });
      }
    },
  });
}

export function useDeleteLpjBendahara() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/lpj-bendahara/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus dokumen LPJ Bendahara.");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lpj-bendahara-documents"] });
    },
  });
}
