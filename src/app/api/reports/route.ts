import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import { isReportType, type ReportType } from "@/lib/reports/report-types";
import { uploadReportDocument } from "@/lib/reports/report-services";
import { getReportDocumentsByYear } from "@/lib/reports/report-queries";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const reportType = searchParams.get("reportType");
  const year = searchParams.get("year");

  if (!reportType || !isReportType(reportType)) {
    return NextResponse.json({ error: "Jenis laporan tidak valid." }, { status: 400 });
  }

  if (!year) {
    return NextResponse.json({ error: "Tahun wajib diisi." }, { status: 400 });
  }

  const yearNumber = Number.parseInt(year, 10);
  if (Number.isNaN(yearNumber)) {
    return NextResponse.json({ error: "Tahun tidak valid." }, { status: 400 });
  }

  try {
    const docs = await getReportDocumentsByYear(reportType as ReportType, yearNumber);
    return NextResponse.json(docs);
  } catch (error) {
    console.error("[GET /api/reports] Fetch error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data laporan." },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error("[POST /api/reports] BLOB_READ_WRITE_TOKEN tidak ditemukan.");
    return NextResponse.json(
      { error: "Konfigurasi storage belum diatur. Hubungi administrator." },
      { status: 500 },
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const title = formData.get("title") as string | null;
    const year = formData.get("year") as string | null;
    const reportType = formData.get("reportType") as string | null;
    const description = formData.get("description") as string | null;

    if (!file || !title || !year || !reportType) {
      return NextResponse.json(
        { error: "File PDF, judul, tahun, dan jenis laporan wajib diisi." },
        { status: 400 },
      );
    }

    if (!isReportType(reportType)) {
      return NextResponse.json(
        { error: "Jenis laporan tidak valid." },
        { status: 400 },
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "File harus berupa PDF." },
        { status: 400 },
      );
    }

    const doc = await uploadReportDocument({
      file,
      title: title,
      year: Number.parseInt(year, 10),
      reportType: reportType,
      description: description,
      uploadedBy: session.user.id,
    });

    return NextResponse.json(doc, { status: 201 });
  } catch (error) {
    console.error("[POST /api/reports] Upload gagal:", error);
    return NextResponse.json(
      { error: "Gagal mengunggah laporan." },
      { status: 500 },
    );
  }
}