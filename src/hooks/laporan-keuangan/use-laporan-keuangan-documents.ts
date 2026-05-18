import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { laporanKeuanganDocuments } from "@/lib/db/schema";

// Type gabungan karena API juga me-return field tambahan seperti uploaderName
type ApiLaporanKeuanganDocument = typeof laporanKeuanganDocuments.$inferSelect & {
  uploaderName?: string | null;
};

export function useLaporanKeuanganDocuments(year: string) {
  return useQuery({
    queryKey: ["laporan-keuangan-documents", year],
    queryFn: async (): Promise<ApiLaporanKeuanganDocument[]> => {
      const res = await fetch(`/api/laporan-keuangan?year=${year}`);
      if (!res.ok) throw new Error("Gagal mengambil data Laporan Keuangan.");
      return res.json();
    },
  });
}

export function useUploadLaporanKeuangan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch("/api/laporan-keuangan", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal mengunggah dokumen Laporan Keuangan.");
      }

      return res.json();
    },
    onSuccess: (_, variables) => {
      const year = variables.get("year");
      if (year) {
        queryClient.invalidateQueries({
          queryKey: ["laporan-keuangan-documents", year.toString()],
        });
      }
    },
  });
}

export function useDeleteLaporanKeuangan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/laporan-keuangan/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus dokumen Laporan Keuangan.");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["laporan-keuangan-documents"] });
    },
  });
}
