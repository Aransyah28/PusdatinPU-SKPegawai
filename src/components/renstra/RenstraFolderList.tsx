"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FolderCard } from "./FolderCard";
import { Button } from "@/components/ui/button";
import { Plus, FolderPlus } from "lucide-react";
import { CreateFolderDialog } from "./CreateFolderDialog";
import { YearCardEmptyState } from "@/components/shared/YearCardEmptyState";
import { YearCardSkeleton } from "@/components/shared/YearCardSkeleton";
import type { RenstraFolderSummary } from "@/lib/renstra/renstra-types";

interface RenstraFolderListProps {
  initialData: RenstraFolderSummary[];
  isAdmin: boolean;
}

export function RenstraFolderList({ initialData, isAdmin }: RenstraFolderListProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: folders, isLoading } = useQuery({
    queryKey: ["renstra-folders"],
    queryFn: async () => {
      const res = await fetch("/api/renstra/folders");
      if (!res.ok) throw new Error("Gagal mengambil data folder");
      return res.json() as Promise<RenstraFolderSummary[]>;
    },
    initialData,
  });

  return (
    <div className="space-y-6">
      {isAdmin && (
        <div className="flex justify-end">
          <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
            <FolderPlus className="w-4 h-4" />
            Tambah Folder
          </Button>
        </div>
      )}

      {isLoading ? (
        <YearCardSkeleton />
      ) : folders.length === 0 ? (
        <YearCardEmptyState message="Belum ada folder dokumen Renstra." />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {folders.map((folder) => (
            <FolderCard
              key={folder.id}
              href={`/renstra/${folder.id}`}
              name={folder.name}
              count={folder.count}
            />
          ))}
        </div>
      )}

      <CreateFolderDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
}
