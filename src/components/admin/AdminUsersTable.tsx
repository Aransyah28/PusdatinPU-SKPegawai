"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, ShieldCheck, User } from "lucide-react";
import { formatDate } from "@/lib/utils/formatters";

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date | null;
}

interface AdminUsersTableProps {
  users: UserRow[];
  currentUserId: string;
}

export function AdminUsersTable({ users, currentUserId }: AdminUsersTableProps) {
  const [localUsers, setLocalUsers] = useState(users);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const roleMutation = useMutation({
    mutationFn: async ({ id, role }: { id: string; role: string }) => {
      const res = await fetch(`/api/admin/users/${id}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      if (!res.ok) {
        const err = await res.json() as { error: string };
        throw new Error(err.error);
      }
      return res.json() as Promise<{ id: string; role: string }>;
    },
    onSuccess: (data) => {
      setLocalUsers((prev) =>
        prev.map((u) => (u.id === data.id ? { ...u, role: data.role } : u)),
      );
      toast.success("Role pengguna berhasil diperbarui.");
      setPendingId(null);
    },
    onError: (err: Error) => {
      toast.error(err.message);
      setPendingId(null);
    },
  });

  const toggleRole = (user: UserRow) => {
    const newRole = user.role === "admin" ? "user" : "admin";
    const label = newRole === "admin" ? "jadikan Admin" : "jadikan User biasa";
    if (!confirm(`Apakah Anda yakin ingin ${label} untuk ${user.name}?`)) return;
    setPendingId(user.id);
    roleMutation.mutate({ id: user.id, role: newRole });
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
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
            {localUsers.map((user) => (
            <tr key={user.id} className="border-b border-border/50 last:border-0 hover:bg-muted/10 transition-colors">
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
                      <User className="h-3 w-3" />
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
                      onClick={() => toggleRole(user)}
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
