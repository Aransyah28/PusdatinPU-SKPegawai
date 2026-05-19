import { put, del } from "@vercel/blob";
import { db } from "@/lib/db/client";
import { laporanKeuanganDocuments } from "@/lib/db/schema";
import { sanitizeFileName } from "@/lib/utils/formatters";

interface UploadLaporanKeuanganParams {
  file: File;
  title: string;
  year: number;
  description: string | null;
  uploadedBy: string;
}

/**
 * Service untuk mengunggah file Laporan Keuangan ke Vercel Blob dan menyimpannya di database Turso.
 */
export async function uploadLaporanKeuanganDocument({
  file,
  title,
  year,
  description,
  uploadedBy,
}: UploadLaporanKeuanganParams) {
  const safeFileName = sanitizeFileName(file.name);
  const blobPath = `LaporanKeuangan/${year}/${crypto.randomUUID()}-${safeFileName}`;

  const blob = await put(blobPath, file, {
    access: "public",
    contentType: "application/pdf",
  });

  try {
    const [doc] = await db
      .insert(laporanKeuanganDocuments)
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
