"use client";

import { useState } from "react";
import { DocumentsAddButton } from "@/components/shared/DocumentsAddButton";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { UploadDialog } from "@/components/documents/UploadDialog";

export function SKPegawaiUploadAction() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();

  return (
    <>
      <DocumentsAddButton
        onClick={() => setOpen(true)}
        label="Tambah Dokumen"
      />

      <UploadDialog
        open={open}
        onOpenChange={setOpen}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["documents"] });
          router.refresh();
        }}
      />
    </>
  );
}
