import { db } from "@/lib/db/client";
import { laporanKeuanganDocuments } from "@/lib/db/schema";
import { sql } from "drizzle-orm";

export interface LaporanKeuanganYearSummary {
  year: number;
  count: number;
}

/**
 * Mendapatkan daftar tahun yang memiliki dokumen Laporan Keuangan beserta jumlah dokumennya.
 * Berguna untuk menampilkan daftar card tahun di halaman utama Laporan Keuangan.
 */
export async function getAvailableLaporanKeuanganYears(): Promise<LaporanKeuanganYearSummary[]> {
  try {
    const results = await db
      .select({
        year: laporanKeuanganDocuments.year,
        count: sql<number>`count(${laporanKeuanganDocuments.id})`.mapWith(Number),
      })
      .from(laporanKeuanganDocuments)
      .groupBy(laporanKeuanganDocuments.year)
      .orderBy(sql`${laporanKeuanganDocuments.year} DESC`);

    return results;
  } catch (error) {
    console.error("Error fetching Laporan Keuangan years:", error);
    return [];
  }
}
