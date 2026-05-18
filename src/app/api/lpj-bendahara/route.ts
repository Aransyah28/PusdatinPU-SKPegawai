import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db/client";
import { lpjBendaharaDocuments, users } from "@/lib/db/schema";
import { uploadLpjBendaharaDocument } from "@/lib/lpj-bendahara/lpj-bendahara-services";
import { headers } from "next/headers";
import { desc, eq } from "drizzle-orm";

/**
 * GET /api/lpj-bendahara
 * Mengambil daftar dokumen LPJ Bendahara.
 * Bisa difilter berdasarkan tahun via query param `year`.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const yearParam = searchParams.get("year");

    let query = db
      .select({
        id: lpjBendaharaDocuments.id,
        title: lpjBendaharaDocuments.title,
        year: lpjBendaharaDocuments.year,
        description: lpjBendaharaDocuments.description,
        fileUrl: lpjBendaharaDocuments.fileUrl,
        fileName: lpjBendaharaDocuments.fileName,
        fileSize: lpjBendaharaDocuments.fileSize,
        uploadedBy: lpjBendaharaDocuments.uploadedBy,
        uploaderName: users.name,
        createdAt: lpjBendaharaDocuments.createdAt,
      })
      .from(lpjBendaharaDocuments)
      .leftJoin(users, eq(lpjBendaharaDocuments.uploadedBy, users.id))
      .$dynamic();

    if (yearParam) {
      const yearInt = parseInt(yearParam, 10);
      if (!isNaN(yearInt)) {
        query = query.where(eq(lpjBendaharaDocuments.year, yearInt));
      }
    }

    const docs = await query.orderBy(desc(lpjBendaharaDocuments.createdAt));

    return NextResponse.json(docs);
  } catch {
    return NextResponse.json(
      { error: "Gagal mengambil data dokumen LPJ Bendahara." },
      { status: 500 },
    );
  }
}

/**
 * POST /api/lpj-bendahara
 * Upload Dokumen LPJ Bendahara baru (PDF).
 * Hanya dapat diakses oleh admin.
 */
export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Konfigurasi storage belum diatur." },
      { status: 500 },
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const title = formData.get("title") as string | null;
    const year = formData.get("year") as string | null;
    const description = formData.get("description") as string | null;

    if (!file || !title || !year) {
      return NextResponse.json(
        { error: "File PDF, judul, dan tahun wajib diisi." },
        { status: 400 },
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "File harus berupa PDF." },
        { status: 400 },
      );
    }

    const yearInt = parseInt(year, 10);
    if (isNaN(yearInt)) {
      return NextResponse.json(
        { error: "Tahun yang dimasukkan tidak valid." },
        { status: 400 },
      );
    }

    const doc = await uploadLpjBendaharaDocument({
      file,
      title,
      year: yearInt,
      description,
      uploadedBy: session.user.id,
    });

    return NextResponse.json(doc, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Gagal mengupload dokumen LPJ Bendahara." },
      { status: 500 },
    );
  }
}
