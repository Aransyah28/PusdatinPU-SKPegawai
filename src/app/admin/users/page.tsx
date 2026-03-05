import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema";
import { AdminUsersTable } from "@/components/admin/AdminUsersTable";

export default async function AdminUsersPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  // Proteksi: hanya admin
  if (!session || session.user.role !== "admin") {
    redirect("/");
  }

  const allUsers = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt,
    })
    .from(users)
    .orderBy(users.createdAt);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white px-4 py-3 shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900">Kelola Pengguna</h1>
          <a href="/" className="text-sm text-blue-600 hover:underline">
            ← Kembali
          </a>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">
        <AdminUsersTable users={allUsers} currentUserId={session.user.id} />
      </main>
    </div>
  );
}
