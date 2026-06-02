import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { getRenstraFolderBySlug, getRenstraDocuments } from "@/lib/renstra/renstra-queries";
import { uploadRenstraDocument } from "@/lib/renstra/renstra-services";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    const folder = await getRenstraFolderBySlug(slug);
    if (!folder) {
      return NextResponse.json(
        { error: "Folder tidak ditemukan." },
        { status: 404 },
      );
    }

    const documents = await getRenstraDocuments(folder.id);
    return NextResponse.json(documents);
  } catch (err) {
    console.error("[GET /api/renstra/folders/[slug]/documents] Error:", err);
    return NextResponse.json(
      { error: "Gagal mengambil daftar dokumen." },
      { status: 500 },
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error("[POST /api/renstra/folders/[slug]/documents] BLOB_READ_WRITE_TOKEN tidak ditemukan.");
    return NextResponse.json(
      { error: "Konfigurasi storage belum diatur. Hubungi administrator." },
      { status: 500 },
    );
  }

  try {
    const { slug } = await params;

    const folder = await getRenstraFolderBySlug(slug);
    if (!folder) {
      return NextResponse.json(
        { error: "Folder tidak ditemukan." },
        { status: 404 },
      );
    }

    const formData = await req.formData();
    const file = formData.get("file");
    const title = formData.get("title") as string | null;
    const year = formData.get("year") as string | null;
    const description = formData.get("description") as string | null;

    if (!file || typeof file === "string" || !title || !year) {
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

    const parsedYear = Number.parseInt(year, 10);
    if (Number.isNaN(parsedYear) || parsedYear < 1900 || parsedYear > 2100) {
      return NextResponse.json(
        { error: "Tahun tidak valid. Masukkan tahun berupa angka (contoh: 2024)." },
        { status: 400 },
      );
    }

    const doc = await uploadRenstraDocument({
      file,
      folderId: folder.id,
      title,
      year: parsedYear,
      description,
      uploadedBy: session.user.id,
    });

    return NextResponse.json(doc, { status: 201 });
  } catch (err) {
    console.error("[POST /api/renstra/folders/[slug]/documents] Upload gagal:", err);
    return NextResponse.json(
      { error: "Gagal mengupload dokumen." },
      { status: 500 },
    );
  }
}
