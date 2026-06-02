import { db } from "@/lib/db/client";
import { lakipFolders, lakipDocuments, users } from "@/lib/db/schema";
import { desc, eq, sql } from "drizzle-orm";
import type { LakipFolderSummary } from "./lakip-types";

export async function getLakipFolders(): Promise<LakipFolderSummary[]> {
  try {
    const results = await db
      .select({
        id: lakipFolders.id,
        name: lakipFolders.name,
        slug: lakipFolders.slug,
        count: sql<number>`count(${lakipDocuments.id})`.mapWith(Number),
      })
      .from(lakipFolders)
      .leftJoin(lakipDocuments, eq(lakipFolders.id, lakipDocuments.folderId))
      .groupBy(lakipFolders.id)
      .orderBy(sql`${lakipFolders.createdAt} DESC`);

    return results;
  } catch (error) {
    console.error("Error fetching LAKIP folders:", error);
    return [];
  }
}

export async function getLakipFolderBySlug(slug: string) {
  try {
    const results = await db
      .select()
      .from(lakipFolders)
      .where(eq(lakipFolders.slug, slug))
      .limit(1);

    return results[0] || null;
  } catch (error) {
    console.error("Error fetching LAKIP folder by slug:", error);
    return null;
  }
}

export async function getLakipDocuments(folderId: string) {
  return db
    .select({
      id: lakipDocuments.id,
      title: lakipDocuments.title,
      year: lakipDocuments.year,
      description: lakipDocuments.description,
      fileUrl: lakipDocuments.fileUrl,
      fileName: lakipDocuments.fileName,
      fileSize: lakipDocuments.fileSize,
      uploadedBy: lakipDocuments.uploadedBy,
      uploaderName: users.name,
      createdAt: lakipDocuments.createdAt,
    })
    .from(lakipDocuments)
    .leftJoin(users, eq(lakipDocuments.uploadedBy, users.id))
    .where(eq(lakipDocuments.folderId, folderId))
    .orderBy(desc(lakipDocuments.createdAt));
}

export type LakipDocumentRow = Awaited<ReturnType<typeof getLakipDocuments>>[number];
