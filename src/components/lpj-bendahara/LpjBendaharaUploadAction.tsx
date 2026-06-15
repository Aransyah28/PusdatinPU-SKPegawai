"use client";

import { useState } from "react";
import { DocumentsAddButton } from "@/components/shared/DocumentsAddButton";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { LpjBendaharaUploadDialog } from "@/components/lpj-bendahara/LpjBendaharaUploadDialog";

export function LpjBendaharaUploadAction() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();

  return (
    <>
      <DocumentsAddButton
        onClick={() => setOpen(true)}
        label="Tambah Dokumen"
      />

      <LpjBendaharaUploadDialog
        open={open}
        onOpenChange={setOpen}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["lpj-bendahara-documents"] });
          router.refresh();
        }}
      />
    </>
  );
}
