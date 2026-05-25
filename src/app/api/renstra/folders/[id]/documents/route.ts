import { NextRequest, NextResponse } from "next/server";
import { getRenstraDocuments } from "@/lib/renstra/renstra-queries";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const docs = await getRenstraDocuments(id);
    return NextResponse.json(docs);
  } catch (err) {
    return NextResponse.json(
      { error: "Gagal mengambil data dokumen." },
      { status: 500 },
    );
  }
}
