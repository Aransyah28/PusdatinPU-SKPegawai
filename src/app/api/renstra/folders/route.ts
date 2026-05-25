import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db/client";
import { renstraFolders } from "@/lib/db/schema";
import { headers } from "next/headers";
import { getRenstraFolders } from "@/lib/renstra/renstra-queries";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const folders = await getRenstraFolders();
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

  if (!session || session.user.role !== "admin") {
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

    // Periksa apakah folder dengan nama yang sama sudah ada
    const existingFolder = await db
      .select()
      .from(renstraFolders)
      .where(eq(renstraFolders.name, name.trim()))
      .limit(1);

    if (existingFolder.length > 0) {
      return NextResponse.json(
        { error: "Folder dengan nama tersebut sudah ada." },
        { status: 400 },
      );
    }

    const [folder] = await db
      .insert(renstraFolders)
      .values({ name: name.trim() })
      .returning();

    return NextResponse.json(folder, { status: 201 });
  } catch (err) {
    console.error("[POST /api/renstra/folders] Error:", err);
    return NextResponse.json(
      { error: "Gagal membuat folder." },
      { status: 500 },
    );
  }
}
