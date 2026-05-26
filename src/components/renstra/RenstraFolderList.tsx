"use client";

import { useState } from "react";
import { FolderCard } from "./FolderCard";
import { Button } from "@/components/ui/button";
import { FolderPlus } from "lucide-react";
import { CreateFolderDialog } from "./CreateFolderDialog";
import { YearCardEmptyState } from "@/components/shared/YearCardEmptyState";
import { YearCardSkeleton } from "@/components/shared/YearCardSkeleton";
import { useRenstraFolders } from "@/hooks/renstra/use-renstra-folders";
import type { RenstraFolderSummary } from "@/lib/renstra/renstra-types";

interface RenstraFolderListProps {
  initialData: RenstraFolderSummary[];
  isAdmin: boolean;
}

export function RenstraFolderList({ initialData, isAdmin }: RenstraFolderListProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: folders, isLoading } = useRenstraFolders(initialData);

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
              href={`/renstra/${folder.slug}`}
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
