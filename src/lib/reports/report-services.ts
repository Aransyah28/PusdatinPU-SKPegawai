import { put, del } from "@vercel/blob";
import { db } from "@/lib/db/client";
import { documents } from "@/lib/db/schema";
import { reportTypeMap, type ReportType } from "./report-types";

import { sanitizeFileName } from "@/lib/utils/formatters";

interface UploadReportParams {
  file: File;
  title: string;
  year: number;
  reportType: ReportType;
  description: string | null;
  uploadedBy: string;
}

/**
 * Service untuk mengunggah file Laporan ke Vercel Blob dan menyimpannya di database Turso.
 */
export async function uploadReportDocument({
  file,
  title,
  year,
  reportType,
  description,
  uploadedBy,
}: UploadReportParams) {
  const config = reportTypeMap[reportType];
  const safeFileName = sanitizeFileName(file.name);
  const blobPath = `${config.blobDirectory}/${year}/${Date.now()}-${safeFileName}`;

  const blob = await put(blobPath, file, {
    access: "public",
    contentType: "application/pdf",
  });

  try {
    const [doc] = await db
      .insert(documents)
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

    return { ...doc, reportType };
  } catch (error) {
    await del(blob.url);
    throw error;
  }
}
