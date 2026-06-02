import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema";
import { AdminUsersTable } from "@/components/admin/AdminUsersTable";
import { AppLayout } from "@/components/layout/AppLayout";

export const metadata = {
  title: "Kelola Pengguna - Pusdatin PU",
  description: "Dashboard manajemen role dan akun pengguna.",
};

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
    <AppLayout user={session.user}>
      <div className="mb-6">
        <h1 className="text-title-lg text-heading">Kelola Pengguna</h1>
        <p className="text-body-sm text-body/60">Manajemen role dan akun pengguna.</p>
      </div>
      <AdminUsersTable users={allUsers} currentUserId={session.user.id} />
    </AppLayout>
  );
}
