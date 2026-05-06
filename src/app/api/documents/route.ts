import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db/client";
import { documents, users } from "@/lib/db/schema";
import { uploadSkPegawaiDocument } from "@/lib/documents/document-services";
import { headers } from "next/headers";
import { desc, eq, like } from "drizzle-orm";

/**
 * GET /api/documents
 * Mengambil semua dokumen SK Kepegawaian beserta nama pengupload.
 * Dapat diakses oleh semua user (publik).
 */
export async function GET() {
  try {
    const docs = await db
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
      .where(like(documents.fileUrl, "%/SKPegawai/%"))
      .orderBy(desc(documents.year), desc(documents.createdAt));

    return NextResponse.json(docs);
  } catch {
    return NextResponse.json(
      { error: "Gagal mengambil data dokumen." },
      { status: 500 },
    );
  }
}

/**
 * POST /api/documents
 * Upload SK Kepegawaian baru (PDF).
 * Hanya dapat diakses oleh admin.
 */
export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
  }

  // Early check: pastikan BLOB_READ_WRITE_TOKEN sudah diset
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error("[POST /api/documents] BLOB_READ_WRITE_TOKEN tidak ditemukan.");
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

    // Upload ke Vercel Blob dan Simpan ke database via Service
    const doc = await uploadSkPegawaiDocument({
      file,
      title: title,
      year: parseInt(year, 10),
      description: description,
      uploadedBy: session.user.id,
    });

    return NextResponse.json(doc, { status: 201 });
  } catch (err) {
    console.error("[POST /api/documents] Upload gagal:", err);
    return NextResponse.json(
      { error: "Gagal mengupload dokumen." },
      { status: 500 },
    );
  }
}
