import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db/client";
import { documents } from "@/lib/db/schema";
import { isReportType, reportTypeMap } from "@/lib/reports/report-types";

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

    const config = reportTypeMap[reportType];
    const safeFileName = file.name.replace(/\s+/g, "-");
    const blobPath = `${config.blobDirectory}/${year}/${Date.now()}-${safeFileName}`;

    const blob = await put(blobPath, file, {
      access: "public",
      contentType: "application/pdf",
    });

    const [doc] = await db
      .insert(documents)
      .values({
        title: title.trim(),
        year: Number.parseInt(year, 10),
        description: description?.trim() ?? null,
        fileUrl: blob.url,
        fileName: file.name,
        fileSize: file.size,
        uploadedBy: session.user.id,
      })
      .returning();

    return NextResponse.json({ ...doc, reportType }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/reports] Upload gagal:", error);
    return NextResponse.json(
      { error: "Gagal mengunggah laporan." },
      { status: 500 },
    );
  }
}