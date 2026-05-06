import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db/client";
import { sopDocuments } from "@/lib/db/schema";
import { put } from "@vercel/blob";
import { headers } from "next/headers";
import { isSopBidang, type SopBidang } from "@/lib/sops/sop-types";
import { getSopDocuments } from "@/lib/sops/sop-queries";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const bidang = searchParams.get("bidang");
  const year = searchParams.get("year");

  let parsedYear: number | undefined;
  if (year) {
    parsedYear = Number.parseInt(year, 10);
    if (Number.isNaN(parsedYear)) {
      return NextResponse.json({ error: "Tahun tidak valid." }, { status: 400 });
    }
  }

  if (bidang && !isSopBidang(bidang)) {
    return NextResponse.json({ error: "Bidang tidak valid." }, { status: 400 });
  }

  try {
    const docs = await getSopDocuments(
      bidang as SopBidang | undefined, 
      parsedYear
    );
    return NextResponse.json(docs);
  } catch (error) {
    console.error("[GET /api/sops] Fetch error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data dokumen SOP." },
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
    console.error("[POST /api/sops] BLOB_READ_WRITE_TOKEN tidak ditemukan.");
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
    const bidang = formData.get("bidang") as string | null;
    const description = formData.get("description") as string | null;

    if (!file || !title || !year || !bidang) {
      return NextResponse.json(
        { error: "File PDF, judul, bidang, dan tahun wajib diisi." },
        { status: 400 },
      );
    }

    if (!isSopBidang(bidang)) {
      return NextResponse.json(
        { error: "Bidang tidak valid." },
        { status: 400 },
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "File harus berupa PDF." },
        { status: 400 },
      );
    }

    const safeFileName = file.name.replace(/\s+/g, "-");
    const blobPath = `SOP/${bidang}/${year}/${Date.now()}-${safeFileName}`;

    const blob = await put(blobPath, file, {
      access: "public",
      contentType: "application/pdf",
    });

    const [doc] = await db
      .insert(sopDocuments)
      .values({
        title: title.trim(),
        year: Number.parseInt(year, 10),
        bidang: bidang,
        description: description?.trim() ?? null,
        fileUrl: blob.url,
        fileName: file.name,
        fileSize: file.size,
        uploadedBy: session.user.id,
      })
      .returning();

    return NextResponse.json(doc, { status: 201 });
  } catch (err) {
    console.error("[POST /api/sops] Upload gagal:", err);
    return NextResponse.json(
      { error: "Gagal mengupload dokumen SOP." },
      { status: 500 },
    );
  }
}
