import { db } from "@/lib/db/client";
import { rkaklDocuments } from "@/lib/db/schema";
import { sql } from "drizzle-orm";

export interface RkaklYearSummary {
  year: number;
  count: number;
}

/**
 * Mendapatkan daftar tahun yang memiliki dokumen RKAKL beserta jumlah dokumennya.
 * Berguna untuk menampilkan daftar card tahun di halaman utama RKAKL.
 */
export async function getAvailableRkaklYears(): Promise<RkaklYearSummary[]> {
  try {
    const results = await db
      .select({
        year: rkaklDocuments.year,
        count: sql<number>`count(${rkaklDocuments.id})`.mapWith(Number),
      })
      .from(rkaklDocuments)
      .groupBy(rkaklDocuments.year)
      .orderBy(sql`${rkaklDocuments.year} DESC`);

    return results;
  } catch (error) {
    console.error("Error fetching RKAKL years:", error);
    return [];
  }
}
