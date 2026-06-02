import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db/client";
import { lakipFolders, lakipDocuments } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { del } from "@vercel/blob";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
  }

  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json({ error: "Slug folder tidak valid." }, { status: 400 });
    }

    // Cari folder berdasarkan slug
    const [folder] = await db
      .select({ id: lakipFolders.id })
      .from(lakipFolders)
      .where(eq(lakipFolders.slug, slug))
      .limit(1);

    if (!folder) {
      return NextResponse.json({ error: "Folder tidak ditemukan." }, { status: 404 });
    }

    // Ambil dokumen di dalam folder untuk menghapus blob-nya
    const docs = await db
      .select({ fileUrl: lakipDocuments.fileUrl })
      .from(lakipDocuments)
      .where(eq(lakipDocuments.folderId, folder.id));


    // Menghapus folder terlebih dahulu (dokumen akan terhapus jika di-set CASCADE)
    await db.delete(lakipFolders).where(eq(lakipFolders.id, folder.id));
    // Hapus blob dari Vercel Blob setelah data di database berhasil dihapus
    if (docs.length > 0) {
      const urlsToDelete = docs.map((doc) => doc.fileUrl);
      try {
        await del(urlsToDelete);
      } catch (blobErr) {
        console.error("Gagal menghapus file dari Vercel Blob (Lakip Folders):", blobErr);
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("[DELETE /api/lakip/folders/[slug]] Error:", err);
    return NextResponse.json(
      { error: "Gagal menghapus folder." },
      { status: 500 },
    );
  }
}
