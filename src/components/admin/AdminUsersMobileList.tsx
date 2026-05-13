import { Loader2, ShieldCheck, User as UserIcon } from "lucide-react";
import { formatDate } from "@/lib/utils/formatters";
import type { UserRow } from "@/hooks/admin/use-admin-users";

interface AdminUsersMobileListProps {
  users: UserRow[];
  currentUserId: string;
  pendingId: string | null;
  onToggleRole: (user: UserRow) => void;
}

export function AdminUsersMobileList({
  users,
  currentUserId,
  pendingId,
  onToggleRole,
}: AdminUsersMobileListProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:hidden">
      {users.map((user) => (
        <div
          key={user.id}
          className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-body-md font-bold text-heading">{user.name}</h3>
              <p className="text-body-sm text-body">{user.email}</p>
            </div>
            {user.role === "admin" ? (
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-accent-blue/30 px-2.5 py-0.5 text-label-md font-bold text-accent-blue-foreground">
                <ShieldCheck className="h-3 w-3" />
                Admin
              </span>
            ) : (
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-label-md font-bold text-body">
                <UserIcon className="h-3 w-3" />
                User
              </span>
            )}
          </div>

          <div className="mt-1 flex items-center justify-between text-body-sm text-body/70">
            <span>Terdaftar:</span>
            <span>{formatDate(user.createdAt)}</span>
          </div>

          <div className="mt-1 flex justify-end border-t border-border/50 pt-3">
            {user.id === currentUserId ? (
              <span className="px-3 py-1.5 text-label-md text-body/30">(Anda)</span>
            ) : (
              <button
                onClick={() => onToggleRole(user)}
                disabled={pendingId === user.id}
                className="flex w-full justify-center rounded-full border border-border px-4 py-2 text-label-md font-bold text-body transition-all hover:bg-muted active:scale-95 disabled:opacity-50 sm:w-auto"
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
          </div>
        </div>
      ))}
    </div>
  );
}
