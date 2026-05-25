"use client";

import { useQuery } from "@tanstack/react-query";
import type { RenstraFolderSummary } from "@/lib/renstra/renstra-types";

export function useRenstraFolders(initialData: RenstraFolderSummary[]) {
  return useQuery({
    queryKey: ["renstra-folders"],
    queryFn: async () => {
      const res = await fetch("/api/renstra/folders");
      if (!res.ok) throw new Error("Gagal mengambil data folder");
      return res.json() as Promise<RenstraFolderSummary[]>;
    },
    initialData,
  });
}
