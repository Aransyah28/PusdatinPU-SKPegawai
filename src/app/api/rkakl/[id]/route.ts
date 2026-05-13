import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db/client";
import { rkaklDocuments } from "@/lib/db/schema";
import { del } from "@vercel/blob";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

/**
 * DELETE /api/rkakl/[id]
 * Menghapus dokumen RKAKL dari database dan Vercel Blob.
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
      .from(rkaklDocuments)
      .where(eq(rkaklDocuments.id, docId));

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
    await db.delete(rkaklDocuments).where(eq(rkaklDocuments.id, docId));

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Gagal menghapus dokumen RKAKL." },
      { status: 500 },
    );
  }
}
