import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { documents } from "@/lib/db/schema";
import { sql } from "drizzle-orm";

interface AvailableYear {
  year: number;
  count: number;
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ reportType: string }> }
) {
  try {
    const { reportType } = await context.params;

    // Map reportType ke description prefix
    const typeMap: Record<string, string> = {
      bulanan: "bulanan",
      kinerja: "kinerja",
      mingguan: "mingguan",
      triwulan: "triwulan",
    };

    const prefix = typeMap[reportType];
    if (!prefix) {
      return NextResponse.json(
        { error: "Report type tidak valid" },
        { status: 400 }
      );
    }

    // Fetch years dengan count documents
    const result = await db
      .select({
        year: documents.year,
        count: sql<number>`count(*)`,
      })
      .from(documents)
      .where(sql`LOWER(${documents.description}) LIKE ${"%" + prefix.toLowerCase() + "%"}`)
      .groupBy(documents.year)
      .orderBy((t) => sql`${t.year} DESC`);

    const data: AvailableYear[] = result.map((r) => ({
      year: r.year,
      count: r.count,
    }));

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching available years:", error);
    return NextResponse.json(
      { error: "Gagal memuat tahun yang tersedia" },
      { status: 500 }
    );
  }
}
