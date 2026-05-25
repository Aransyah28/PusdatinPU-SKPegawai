import { db } from "@/lib/db/client";
import { renstraFolders, renstraDocuments, users } from "@/lib/db/schema";
import { desc, eq, sql } from "drizzle-orm";
import type { RenstraFolderSummary } from "./renstra-types";

export async function getRenstraFolders(): Promise<RenstraFolderSummary[]> {
  try {
    const results = await db
      .select({
        id: renstraFolders.id,
        name: renstraFolders.name,
        count: sql<number>`count(${renstraDocuments.id})`.mapWith(Number),
      })
      .from(renstraFolders)
      .leftJoin(renstraDocuments, eq(renstraFolders.id, renstraDocuments.folderId))
      .groupBy(renstraFolders.id)
      .orderBy(sql`${renstraFolders.createdAt} DESC`);

    return results;
  } catch (error) {
    console.error("Error fetching Renstra folders:", error);
    return [];
  }
}

export async function getRenstraFolderById(id: string) {
  try {
    const results = await db
      .select()
      .from(renstraFolders)
      .where(eq(renstraFolders.id, id))
      .limit(1);
    
    return results[0] || null;
  } catch (error) {
    console.error("Error fetching Renstra folder by id:", error);
    return null;
  }
}

export async function getRenstraDocuments(folderId: string) {
  return db
    .select({
      id: renstraDocuments.id,
      title: renstraDocuments.title,
      year: renstraDocuments.year,
      description: renstraDocuments.description,
      fileUrl: renstraDocuments.fileUrl,
      fileName: renstraDocuments.fileName,
      fileSize: renstraDocuments.fileSize,
      uploadedBy: renstraDocuments.uploadedBy,
      uploaderName: users.name,
      createdAt: renstraDocuments.createdAt,
    })
    .from(renstraDocuments)
    .leftJoin(users, eq(renstraDocuments.uploadedBy, users.id))
    .where(eq(renstraDocuments.folderId, folderId))
    .orderBy(desc(renstraDocuments.createdAt));
}

export type RenstraDocumentRow = Awaited<ReturnType<typeof getRenstraDocuments>>[number];
