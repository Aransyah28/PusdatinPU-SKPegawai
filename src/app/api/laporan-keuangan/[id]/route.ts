import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db/client";
import { laporanKeuanganDocuments } from "@/lib/db/schema";
import { del } from "@vercel/blob";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

/**
 * DELETE /api/laporan-keuangan/[id]
 * Menghapus dokumen Laporan Keuangan dari database dan Vercel Blob.
 * Hanya dapat diakses oleh admin.
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
  }

  const resolvedParams = await params;

  try {
    const docId = resolvedParams.id;

    // Ambil info dokumen dulu untuk mendapatkan URL Vercel Blob
    const [doc] = await db
      .select()
      .from(laporanKeuanganDocuments)
      .where(eq(laporanKeuanganDocuments.id, docId));

    if (!doc) {
      return NextResponse.json(
        { error: "Dokumen tidak ditemukan." },
        { status: 404 },
      );
    }

    // Hapus dari Vercel Blob
    if (doc.fileUrl) {
      await del(doc.fileUrl);
    }

    // Hapus dari database
    await db.delete(laporanKeuanganDocuments).where(eq(laporanKeuanganDocuments.id, docId));

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Gagal menghapus dokumen Laporan Keuangan." },
      { status: 500 },
    );
  }
}
