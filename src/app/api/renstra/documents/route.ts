import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { uploadRenstraDocument } from "@/lib/renstra/renstra-services";

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error("[POST /api/renstra/documents] BLOB_READ_WRITE_TOKEN tidak ditemukan.");
    return NextResponse.json(
      { error: "Konfigurasi storage belum diatur. Hubungi administrator." },
      { status: 500 },
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folderId = formData.get("folderId") as string | null;
    const title = formData.get("title") as string | null;
    const year = formData.get("year") as string | null;
    const description = formData.get("description") as string | null;

    if (!file || !folderId || !title || !year) {
      return NextResponse.json(
        { error: "File PDF, folder, judul, dan tahun wajib diisi." },
        { status: 400 },
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "File harus berupa PDF." },
        { status: 400 },
      );
    }

    const parsedYear = Number.parseInt(year, 10);
    if (Number.isNaN(parsedYear) || parsedYear < 1900 || parsedYear > 2100) {
      return NextResponse.json(
        { error: "Tahun tidak valid. Masukkan tahun berupa angka (contoh: 2024)." },
        { status: 400 },
      );
    }

    const doc = await uploadRenstraDocument({
      file,
      folderId,
      title,
      year: parsedYear,
      description,
      uploadedBy: session.user.id,
    });

    return NextResponse.json(doc, { status: 201 });
  } catch (err) {
    console.error("[POST /api/renstra/documents] Upload gagal:", err);
    return NextResponse.json(
      { error: "Gagal mengupload dokumen." },
      { status: 500 },
    );
  }
}
