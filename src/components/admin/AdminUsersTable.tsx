"use client";

import { useAdminUsers } from "@/hooks/admin/use-admin-users";
import { AdminUsersDesktopTable } from "./AdminUsersDesktopTable";
import { AdminUsersMobileList } from "./AdminUsersMobileList";
import type { UserRow } from "@/hooks/admin/use-admin-users";

interface AdminUsersTableProps {
  users: UserRow[];
  currentUserId: string;
}

export function AdminUsersTable({ users, currentUserId }: AdminUsersTableProps) {
  const { localUsers, pendingId, toggleRole } = useAdminUsers(users);

  return (
    <div className="space-y-4">
      <AdminUsersDesktopTable
        users={localUsers}
        currentUserId={currentUserId}
        pendingId={pendingId}
        onToggleRole={toggleRole}
      />
      <AdminUsersMobileList
        users={localUsers}
        currentUserId={currentUserId}
        pendingId={pendingId}
        onToggleRole={toggleRole}
      />
    </div>
  );
}
