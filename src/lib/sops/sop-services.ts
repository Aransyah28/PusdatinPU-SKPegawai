import { put } from "@vercel/blob";
import { db } from "@/lib/db/client";
import { sopDocuments } from "@/lib/db/schema";
import type { SopBidang } from "./sop-types";

interface UploadSopDocumentParams {
  file: File;
  title: string;
  year: number;
  bidang: SopBidang;
  description: string | null;
  uploadedBy: string;
}

/**
 * Service untuk mengunggah file SOP ke Vercel Blob dan menyimpannya di database Turso.
 */
export async function uploadSopDocument({
  file,
  title,
  year,
  bidang,
  description,
  uploadedBy,
}: UploadSopDocumentParams) {
  const safeFileName = file.name.replace(/\s+/g, "-");
  const blobPath = `SOP/${bidang}/${year}/${Date.now()}-${safeFileName}`;

  const blob = await put(blobPath, file, {
    access: "public",
    contentType: "application/pdf",
  });

  const [doc] = await db
    .insert(sopDocuments)
    .values({
      title: title.trim(),
      year: year,
      bidang: bidang,
      description: description?.trim() ?? null,
      fileUrl: blob.url,
      fileName: file.name,
      fileSize: file.size,
      uploadedBy: uploadedBy,
    })
    .returning();

  return doc;
}
