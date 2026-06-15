"use client";

import { useState } from "react";
import { DocumentsAddButton } from "@/components/shared/DocumentsAddButton";
import { useQueryClient } from "@tanstack/react-query";
import { RkaklUploadDialog } from "@/components/rkakl/RkaklUploadDialog";

export function RkaklUploadAction() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  return (
    <>
      <DocumentsAddButton
        onClick={() => setOpen(true)}
        label="Tambah Dokumen"
      />

      <RkaklUploadDialog
        open={open}
        onOpenChange={setOpen}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["rkakl"] });
        }}
      />
    </>
  );
}
