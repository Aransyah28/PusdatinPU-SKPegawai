import { and, desc, eq, like, sql } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { documents, users } from "@/lib/db/schema";
import { reportTypeMap, type ReportType } from "@/lib/reports/report-types";

export async function getReportDocumentsByYear(reportType: ReportType, year: number) {
  const config = reportTypeMap[reportType];
  const prefix = `%/${config.blobDirectory}/${year}/%`;

  return db
    .select({
      id: documents.id,
      title: documents.title,
      year: documents.year,
      description: documents.description,
      fileUrl: documents.fileUrl,
      fileName: documents.fileName,
      fileSize: documents.fileSize,
      uploadedBy: documents.uploadedBy,
      uploaderName: users.name,
      createdAt: documents.createdAt,
    })
    .from(documents)
    .leftJoin(users, eq(documents.uploadedBy, users.id))
    .where(and(eq(documents.year, year), like(documents.fileUrl, prefix)))
    .orderBy(desc(documents.createdAt));
}

export type ReportDocumentRow = Awaited<
  ReturnType<typeof getReportDocumentsByYear>
>[number];

export async function getReportYears(reportType: ReportType) {
  const config = reportTypeMap[reportType];
  const prefix = `%/${config.blobDirectory}/%`;

  return db
    .select({
      year: documents.year,
      count: sql<number>`count(*)`,
    })
    .from(documents)
    .where(like(documents.fileUrl, prefix))
    .groupBy(documents.year)
    .orderBy((t) => sql`${t.year} DESC`);
}
