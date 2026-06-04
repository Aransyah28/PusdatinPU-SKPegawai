import { db } from "@/lib/db/client";
import { documents } from "@/lib/db/schema";
import { sql, like } from "drizzle-orm";

export interface SKPegawaiYearSummary {
  year: number;
  count: number;
}

/**
 * Mendapatkan daftar tahun yang memiliki dokumen SK Pegawai beserta jumlah dokumennya.
 * Berguna untuk menampilkan daftar card tahun di halaman utama SK Pegawai.
 */
export async function getAvailableSKPegawaiYears(): Promise<SKPegawaiYearSummary[]> {
  try {
    const results = await db
      .select({
        year: documents.year,
        count: sql<number>`count(${documents.id})`.mapWith(Number),
      })
      .from(documents)
      // Filter hanya untuk dokumen SK Pegawai (berdasarkan fileUrl path atau kolom lain, 
      // dari route.ts sebelumnya filter SK Pegawai adalah: like(documents.fileUrl, "%/SKPegawai/%"))
      .where(like(documents.fileUrl, "%/SKPegawai/%"))
      .groupBy(documents.year)
      .orderBy(sql`${documents.year} DESC`);

    return results;
  } catch (error) {
    console.error("Error fetching SK Pegawai years:", error);
    return [];
  }
}
