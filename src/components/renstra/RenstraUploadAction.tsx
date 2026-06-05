"use client";

import { useState } from "react";
import { DocumentsAddButton } from "@/components/shared/DocumentsAddButton";
import { RenstraUploadDialog } from "@/components/renstra/RenstraUploadDialog";

interface RenstraUploadActionProps {
  folderSlug: string;
}

export function RenstraUploadAction({ folderSlug }: RenstraUploadActionProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <DocumentsAddButton
        onClick={() => setOpen(true)}
        label="Tambah Dokumen"
      />
      
      <RenstraUploadDialog
        open={open}
        onOpenChange={setOpen}
        folderSlug={folderSlug}
      />
    </>
  );
}
