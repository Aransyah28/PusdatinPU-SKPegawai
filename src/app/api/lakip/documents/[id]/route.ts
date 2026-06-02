import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db/client";
import { lakipDocuments } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { del } from "@vercel/blob";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
  }

  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "ID dokumen tidak valid." }, { status: 400 });
    }

    const [doc] = await db
      .select({ fileUrl: lakipDocuments.fileUrl })
      .from(lakipDocuments)
      .where(eq(lakipDocuments.id, id));

    if (!doc) {
      return NextResponse.json(
        { error: "Dokumen tidak ditemukan." },
        { status: 404 },
      );
    }

    if (doc.fileUrl) {
      try {
        await del(doc.fileUrl);
      } catch (blobErr) {
        console.error("Gagal menghapus file dari Vercel Blob:", blobErr);
      }
    }

    await db.delete(lakipDocuments).where(eq(lakipDocuments.id, id));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/lakip/documents/[id]] Error:", err);
    return NextResponse.json(
      { error: "Gagal menghapus dokumen." },
      { status: 500 },
    );
  }
}
