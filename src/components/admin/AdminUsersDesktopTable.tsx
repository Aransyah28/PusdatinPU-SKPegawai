import { Loader2, ShieldCheck, User as UserIcon } from "lucide-react";
import { formatDate } from "@/lib/utils/formatters";
import type { UserRow } from "@/hooks/admin/use-admin-users";

interface AdminUsersDesktopTableProps {
  users: UserRow[];
  currentUserId: string;
  pendingId: string | null;
  onToggleRole: (user: UserRow) => void;
}

export function AdminUsersDesktopTable({
  users,
  currentUserId,
  pendingId,
  onToggleRole,
}: AdminUsersDesktopTableProps) {
  return (
    <div className="hidden overflow-hidden rounded-2xl border border-border bg-card shadow-sm md:block">
      <div className="overflow-x-auto">
        <table className="w-full text-body-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30 text-left">
              <th className="px-4 py-4 text-title-sm font-bold text-heading">Nama</th>
              <th className="px-4 py-4 text-title-sm font-bold text-heading">Email</th>
              <th className="px-4 py-4 text-title-sm font-bold text-heading">Role</th>
              <th className="px-4 py-4 text-title-sm font-bold text-heading">Terdaftar</th>
              <th className="px-4 py-4 text-center text-title-sm font-bold text-heading">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-border/50 transition-colors last:border-0 hover:bg-muted/10"
              >
                <td className="px-4 py-3 text-body-md font-bold text-heading">{user.name}</td>
                <td className="px-4 py-3 text-body-sm text-body">{user.email}</td>
                <td className="px-4 py-3">
                  {user.role === "admin" ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-accent-blue/30 px-2.5 py-0.5 text-label-md font-bold text-accent-blue-foreground">
                      <ShieldCheck className="h-3 w-3" />
                      Admin
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-label-md font-bold text-body">
                      <UserIcon className="h-3 w-3" />
                      User
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-body-sm text-body/70">
                  {formatDate(user.createdAt)}
                </td>
                <td className="px-4 py-3 text-center">
                  {user.id === currentUserId ? (
                    <span className="text-label-md text-body/30">(Anda)</span>
                  ) : (
                    <button
                      onClick={() => onToggleRole(user)}
                      disabled={pendingId === user.id}
                      className="rounded-full border border-border px-3 py-1.5 text-label-md font-bold text-body transition-all hover:bg-muted active:scale-95 disabled:opacity-50"
                    >
                      {pendingId === user.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : user.role === "admin" ? (
                        "Jadikan User"
                      ) : (
                        "Jadikan Admin"
                      )}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
