import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

/**
 * PATCH /api/admin/users/[id]/role
 * Mengubah role user (user ↔ admin).
 * Hanya admin yang dapat mengakses endpoint ini.
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json() as { role: string };
  const newRole = body.role;

  if (!["user", "admin"].includes(newRole)) {
    return NextResponse.json(
      { error: "Role tidak valid. Gunakan 'user' atau 'admin'." },
      { status: 400 },
    );
  }

  // Cegah admin menghapus role dirinya sendiri
  if (session.user.id === id && newRole === "user") {
    return NextResponse.json(
      { error: "Anda tidak bisa mengubah role diri sendiri." },
      { status: 400 },
    );
  }

  const [updated] = await db
    .update(users)
    .set({ role: newRole })
    .where(eq(users.id, id))
    .returning({ id: users.id, role: users.role });

  if (!updated) {
    return NextResponse.json(
      { error: "User tidak ditemukan." },
      { status: 404 },
    );
  }

  return NextResponse.json(updated);
}
