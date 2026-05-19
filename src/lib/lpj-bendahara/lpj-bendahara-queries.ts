import { db } from "@/lib/db/client";
import { lpjBendaharaDocuments } from "@/lib/db/schema";
import { sql } from "drizzle-orm";

export interface LpjBendaharaYearSummary {
  year: number;
  count: number;
}

/**
 * Mendapatkan daftar tahun yang memiliki dokumen LPJ Bendahara beserta jumlah dokumennya.
 * Berguna untuk menampilkan daftar card tahun di halaman utama LPJ Bendahara.
 */
export async function getAvailableLpjBendaharaYears(): Promise<LpjBendaharaYearSummary[]> {
  try {
    const results = await db
      .select({
        year: lpjBendaharaDocuments.year,
        count: sql<number>`count(${lpjBendaharaDocuments.id})`.mapWith(Number),
      })
      .from(lpjBendaharaDocuments)
      .groupBy(lpjBendaharaDocuments.year)
      .orderBy(sql`${lpjBendaharaDocuments.year} DESC`);

    return results;
  } catch (error) {
    console.error("Error fetching LPJ Bendahara years:", error);
    return [];
  }
}
