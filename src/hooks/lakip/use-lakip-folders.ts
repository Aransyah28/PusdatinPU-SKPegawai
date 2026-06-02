"use client";

import { useQuery } from "@tanstack/react-query";
import type { LakipFolderSummary } from "@/lib/lakip/lakip-types";

export function useLakipFolders(initialData: LakipFolderSummary[]) {
  return useQuery({
    queryKey: ["lakip-folders"],
    queryFn: async () => {
      const res = await fetch("/api/lakip/folders");
      if (!res.ok) throw new Error("Gagal mengambil data folder");
      return res.json() as Promise<LakipFolderSummary[]>;
    },
    initialData,
  });
}
