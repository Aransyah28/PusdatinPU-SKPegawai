"use client";

import { useState } from "react";
import { DocumentsAddButton } from "@/components/shared/DocumentsAddButton";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { LaporanKeuanganUploadDialog } from "@/components/laporan-keuangan/LaporanKeuanganUploadDialog";

export function LaporanKeuanganUploadAction() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();

  return (
    <>
      <DocumentsAddButton
        onClick={() => setOpen(true)}
        label="Tambah Dokumen"
      />

      <LaporanKeuanganUploadDialog
        open={open}
        onOpenChange={setOpen}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["laporan-keuangan-documents"] });
          router.refresh();
        }}
      />
    </>
  );
}
