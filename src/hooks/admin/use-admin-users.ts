import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { User } from "@/lib/auth/auth";

export type UserRow = Pick<User, "id" | "name" | "email" | "role"> & {
  createdAt: Date | null;
};

export function useAdminUsers(initialUsers: UserRow[]) {
  const [localUsers, setLocalUsers] = useState(initialUsers);
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

  return { localUsers, pendingId, toggleRole };
}
