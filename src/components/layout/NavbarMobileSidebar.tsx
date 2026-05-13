"use client";

import Link from "next/link";
import { X, Shield, LogOut } from "lucide-react";
import { getInitial } from "@/lib/utils/navbar-utils";
import type { User } from "@/lib/auth/auth";

interface NavbarMobileSidebarProps {
  user: User | null;
  isAdmin: boolean;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export function NavbarMobileSidebar({
  user,
  isAdmin,
  isOpen,
  onClose,
  onLogout,
}: NavbarMobileSidebarProps) {
  if (!isOpen) return null;

  return (
    <div className="sm:hidden">
      {/* Overlay */}
      <button
        type="button"
        aria-label="Tutup sidebar"
        className="fixed inset-0 z-50 h-full w-full cursor-default border-none bg-black/20 backdrop-blur-sm animate-in fade-in"
        onClick={onClose}
        tabIndex={-1}
      />

      {/* Sidebar Panel */}
      <div className="fixed inset-y-0 right-0 z-50 w-[75%] max-w-[260px] border-l border-border bg-card shadow-2xl animate-in slide-in-from-right">
        <div className="flex items-center justify-between p-3 pb-1">
          <span className="text-title-md font-bold">Menu</span>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-body transition-all hover:bg-muted"
            aria-label="Tutup menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col gap-3 p-3">
          {user ? (
            <>
              <div className="flex items-center gap-2.5 px-1 py-1">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-title-sm text-white shadow-sm">
                  {getInitial(user.name)}
                </div>
                <div className="flex min-w-0 flex-col">
                  <p className="truncate text-body-md font-bold text-heading">{user.name}</p>
                  <p className="truncate text-label-md text-body/60">{user.email}</p>
                </div>
              </div>

              <div className="my-1.5 h-[1px] w-full rounded-full bg-primary" />

              <div className="flex flex-col gap-1.5">
                {isAdmin && (
                  <Link
                    href="/admin/users"
                    onClick={onClose}
                    className="flex w-full items-center justify-center gap-2 rounded-full border border-accent-blue-foreground/10 bg-blue-50 px-3 py-2 text-body-sm font-bold text-primary shadow-sm transition-colors hover:bg-accent-blue/80"
                  >
                    <Shield className="h-4 w-4" />
                    Portal Admin
                  </Link>
                )}
                <button
                  onClick={onLogout}
                  className="flex w-full items-center justify-center gap-2 rounded-full px-3 py-2 text-body-sm font-bold text-destructive transition-colors hover:bg-destructive/5"
                >
                  <LogOut className="h-4 w-4" />
                  Keluar
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-2">
              <Link
                href="/auth/login"
                onClick={onClose}
                className="flex w-full items-center justify-center rounded-full border border-border px-4 py-2 text-body-sm font-bold text-body transition-all hover:bg-muted"
              >
                Masuk
              </Link>
              <Link
                href="/auth/register"
                onClick={onClose}
                className="flex w-full items-center justify-center rounded-full bg-primary px-4 py-2 text-body-sm font-bold text-white shadow-md transition-all hover:bg-primary/90"
              >
                Daftar
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
