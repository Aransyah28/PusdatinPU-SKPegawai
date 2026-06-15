"use client";

import { useState } from "react";
import { DocumentsAddButton } from "@/components/shared/DocumentsAddButton";
import { LakipUploadDialog } from "@/components/lakip/LakipUploadDialog";

interface LakipUploadActionProps {
  folderSlug: string;
}

export function LakipUploadAction({ folderSlug }: LakipUploadActionProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <DocumentsAddButton
        onClick={() => setOpen(true)}
        label="Tambah Dokumen"
      />
      
      <LakipUploadDialog
        open={open}
        onOpenChange={setOpen}
        folderSlug={folderSlug}
      />
    </>
  );
}
