import { NextRequest, NextResponse } from "next/server";
import { getReportYears } from "@/lib/reports/report-queries";
import { isReportType } from "@/lib/reports/report-types";

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

    if (!isReportType(reportType)) {
      return NextResponse.json(
        { error: "Report type tidak valid" },
        { status: 400 }
      );
    }

    const result = await getReportYears(reportType);

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
