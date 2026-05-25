import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db/client";
import { renstraFolders, renstraDocuments } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { del } from "@vercel/blob";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
  }

  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "ID folder tidak valid." }, { status: 400 });
    }

    // Ambil dokumen di dalam folder untuk menghapus blob-nya
    const docs = await db
      .select({ fileUrl: renstraDocuments.fileUrl })
      .from(renstraDocuments)
      .where(eq(renstraDocuments.folderId, id));

    // Hapus blob dari Vercel Blob
    if (docs.length > 0) {
      const urlsToDelete = docs.map((doc) => doc.fileUrl);
      // Optional: Batch delete if Vercel Blob supports it, or loop.
      await del(urlsToDelete);
    }

    // Menghapus folder (dokumen akan terhapus jika di-set CASCADE)
    await db.delete(renstraFolders).where(eq(renstraFolders.id, id));

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("[DELETE /api/renstra/folders/[id]] Error:", err);
    return NextResponse.json(
      { error: "Gagal menghapus folder." },
      { status: 500 },
    );
  }
}
