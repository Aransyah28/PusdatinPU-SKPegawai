import { put, del } from "@vercel/blob";
import { db } from "@/lib/db/client";
import { renstraDocuments } from "@/lib/db/schema";
import { sanitizeFileName } from "@/lib/utils/formatters";

interface UploadRenstraParams {
  file: File;
  folderId: string;
  title: string;
  year: number;
  description: string | null;
  uploadedBy: string;
}

export async function uploadRenstraDocument({
  file,
  folderId,
  title,
  year,
  description,
  uploadedBy,
}: UploadRenstraParams) {
  const safeFileName = sanitizeFileName(file.name);
  const blobPath = `Renstra/${folderId}/${year}/${crypto.randomUUID()}-${safeFileName}`;

  const blob = await put(blobPath, file, {
    access: "public",
    contentType: "application/pdf",
  });

  try {
    const [doc] = await db
      .insert(renstraDocuments)
      .values({
        folderId,
        title: title.trim(),
        year,
        description: description?.trim() ?? null,
        fileUrl: blob.url,
        fileName: file.name,
        fileSize: file.size,
        uploadedBy,
      })
      .returning();

    return doc;
  } catch (error) {
    await del(blob.url);
    throw error;
  }
}
