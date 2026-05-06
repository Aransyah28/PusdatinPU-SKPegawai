import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db/client";
import { sopDocuments } from "@/lib/db/schema";
import { del } from "@vercel/blob";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
  }

  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { error: "ID dokumen wajib diberikan." },
      { status: 400 },
    );
  }

  try {
    const [doc] = await db
      .select({ fileUrl: sopDocuments.fileUrl })
      .from(sopDocuments)
      .where(eq(sopDocuments.id, id));

    if (!doc) {
      return NextResponse.json(
        { error: "Dokumen tidak ditemukan." },
        { status: 404 },
      );
    }

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        await del(doc.fileUrl);
      } catch (blobError) {
        console.error(
          `[DELETE /api/sops] Gagal menghapus file di Vercel Blob: ${doc.fileUrl}`,
          blobError,
        );
      }
    } else {
      console.warn(
        "[DELETE /api/sops] BLOB_READ_WRITE_TOKEN tidak ada. File fisik tidak dihapus.",
      );
    }

    await db.delete(sopDocuments).where(eq(sopDocuments.id, id));

    return NextResponse.json(
      { message: "Dokumen SOP berhasil dihapus." },
      { status: 200 },
    );
  } catch (err) {
    console.error("[DELETE /api/sops] Gagal menghapus dokumen:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan internal server." },
      { status: 500 },
    );
  }
}
