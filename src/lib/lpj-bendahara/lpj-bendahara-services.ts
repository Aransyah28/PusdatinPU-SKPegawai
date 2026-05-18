import { put, del } from "@vercel/blob";
import { db } from "@/lib/db/client";
import { lpjBendaharaDocuments } from "@/lib/db/schema";
import { sanitizeFileName } from "@/lib/utils/formatters";

interface UploadLpjBendaharaParams {
  file: File;
  title: string;
  year: number;
  description: string | null;
  uploadedBy: string;
}

/**
 * Service untuk mengunggah file LPJ Bendahara ke Vercel Blob dan menyimpannya di database Turso.
 */
export async function uploadLpjBendaharaDocument({
  file,
  title,
  year,
  description,
  uploadedBy,
}: UploadLpjBendaharaParams) {
  const safeFileName = sanitizeFileName(file.name);
  const blobPath = `LPJBendahara/${year}/${crypto.randomUUID()}-${safeFileName}`;

  const blob = await put(blobPath, file, {
    access: "public",
    contentType: "application/pdf",
  });

  try {
    const [doc] = await db
      .insert(lpjBendaharaDocuments)
      .values({
        title: title.trim(),
        year: year,
        description: description?.trim() ?? null,
        fileUrl: blob.url,
        fileName: file.name,
        fileSize: file.size,
        uploadedBy: uploadedBy,
      })
      .returning();

    return doc;
  } catch (error) {
    // Jika gagal menyimpan ke database, hapus file yang sudah terlanjur diunggah
    await del(blob.url);
    throw error;
  }
}
