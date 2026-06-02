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
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="group inline-flex h-12 min-w-[168px] items-center justify-center gap-2 rounded-[18px] bg-primary px-6 text-[15px] font-black tracking-tight text-white shadow-[0_5px_0_0_#ffd602,0_12px_24px_rgba(24,44,106,0.18)] transition-all duration-150 hover:-translate-y-[1px] hover:shadow-[0_7px_0_0_#ffd602,0_14px_28px_rgba(24,44,106,0.2)] active:translate-y-[2px] active:shadow-[0_4px_0_0_#ffd602,0_8px_16px_rgba(24,44,106,0.14)]"
          >
            <FolderPlus className="h-4 w-4 text-[#ffd602] transition-transform duration-150 group-hover:scale-105" />
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
