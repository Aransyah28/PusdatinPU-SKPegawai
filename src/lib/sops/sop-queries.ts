import { and, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { sopDocuments, users } from "@/lib/db/schema";
import type { SopBidang } from "./sop-types";

export async function getSopDocuments(bidang?: SopBidang, year?: number) {
  let query = db
    .select({
      id: sopDocuments.id,
      title: sopDocuments.title,
      year: sopDocuments.year,
      bidang: sopDocuments.bidang,
      description: sopDocuments.description,
      fileUrl: sopDocuments.fileUrl,
      fileName: sopDocuments.fileName,
      fileSize: sopDocuments.fileSize,
      uploadedBy: sopDocuments.uploadedBy,
      uploaderName: users.name,
      createdAt: sopDocuments.createdAt,
    })
    .from(sopDocuments)
    .leftJoin(users, eq(sopDocuments.uploadedBy, users.id))
    .$dynamic();

  const filters = [];
  if (bidang) filters.push(eq(sopDocuments.bidang, bidang));
  if (year) filters.push(eq(sopDocuments.year, year));
  
  if (filters.length > 0) {
    query = query.where(and(...filters));
  }

  return query.orderBy(desc(sopDocuments.createdAt));
}

export type SopDocumentRow = Awaited<
  ReturnType<typeof getSopDocuments>
>[number];
