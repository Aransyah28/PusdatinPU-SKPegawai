import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db/client";
import { lakipFolders } from "@/lib/db/schema";
import { headers } from "next/headers";
import { getLakipFolders } from "@/lib/lakip/lakip-queries";
import { eq, or } from "drizzle-orm";
import { slugify } from "@/lib/utils/formatters";

export async function GET() {
  try {
    const folders = await getLakipFolders();
    return NextResponse.json(folders);
  } catch (err) {
    return NextResponse.json(
      { error: "Gagal mengambil daftar folder." },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
  }

  try {
    const { name } = await req.json();

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "Nama folder wajib diisi." },
        { status: 400 },
      );
    }

    const trimmedName = name.trim();
    const slug = slugify(trimmedName);

    if (!slug) {
      return NextResponse.json(
        { error: "Nama folder menghasilkan slug yang tidak valid." },
        { status: 400 },
      );
    }

    // Periksa duplikasi berdasarkan nama atau slug dalam satu query
    const existingFolder = await db
      .select({ id: lakipFolders.id, name: lakipFolders.name, slug: lakipFolders.slug })
      .from(lakipFolders)
      .where(or(eq(lakipFolders.name, trimmedName), eq(lakipFolders.slug, slug)))
      .limit(1);
      
    if (existingFolder.length > 0) {
      const folder = existingFolder[0];
      if (folder.name === trimmedName) {
        return NextResponse.json(
          { error: "Folder dengan nama tersebut sudah ada." },
          { status: 409 },
        );
      }
      return NextResponse.json(
        { error: "Folder dengan nama yang mirip sudah ada (slug URL bertabrakan)." },
        { status: 409 },
      );
    }
    const [folder] = await db
      .insert(lakipFolders)
      .values({ name: trimmedName, slug })
      .returning();

    return NextResponse.json(folder, { status: 201 });
  } catch (err) {
    console.error("[POST /api/lakip/folders] Error:", err);
    return NextResponse.json(
      { error: "Gagal membuat folder." },
      { status: 500 },
    );
  }
}
