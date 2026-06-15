"use client";

import { useState } from "react";
import { DocumentsAddButton } from "@/components/shared/DocumentsAddButton";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { SopUploadDialog } from "@/components/sops/SopUploadDialog";
import type { SopBidang } from "@/lib/sops/sop-types";

interface SopUploadActionProps {
  defaultBidang?: SopBidang;
  defaultYear?: number;
}

export function SopUploadAction({ defaultBidang = "MTI", defaultYear }: SopUploadActionProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();

  return (
    <>
      <DocumentsAddButton
        onClick={() => setOpen(true)}
        label="Tambah Dokumen"
      />

      <SopUploadDialog
        open={open}
        onOpenChange={setOpen}
        defaultBidang={defaultBidang}
        defaultYear={defaultYear}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["sops"] });
          router.refresh();
        }}
      />
    </>
  );
}
