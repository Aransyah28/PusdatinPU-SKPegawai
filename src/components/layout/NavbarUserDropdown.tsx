"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { LogOut, Shield } from "lucide-react";
import { getInitial } from "@/lib/utils/navbar-utils";
import type { User } from "@/lib/auth/auth";

interface NavbarUserDropdownProps {
  user: User;
  isAdmin: boolean;
  onLogout: () => void;
}

export function NavbarUserDropdown({ user, isAdmin, onLogout }: NavbarUserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      {isAdmin && (
        <>
          <Link
            href="/admin/users"
            className="ml-2 flex items-center gap-1.5 rounded-full border border-accent-blue-foreground/10 bg-blue-50 px-3 py-1.5 text-body-md font-bold text-primary shadow-sm transition-colors hover:bg-accent-blue/80"
          >
            <Shield className="h-4 w-4" />
            <span>Portal Admin</span>
          </Link>
          <div className="h-5 w-px bg-border" />
        </>
      )}

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-label-lg text-white shadow-md transition-all hover:scale-105 active:scale-95"
          aria-label="Menu akun"
        >
          {getInitial(user.name)}
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full z-50 mt-2 w-48 origin-top-right overflow-hidden rounded-2xl border border-border bg-white py-1 shadow-xl animate-in fade-in zoom-in duration-200">
            <div className="border-b border-border bg-muted/30 px-4 py-3">
              <p className="truncate text-body-md font-bold text-heading">{user.name}</p>
              <p className="truncate text-label-md text-body/60">{user.email}</p>
            </div>
            <div className="p-1">
              <button
                onClick={() => { setIsOpen(false); onLogout(); }}
                className="flex w-full items-center gap-2 rounded-full px-3 py-2 text-label-lg text-destructive transition-all hover:bg-destructive/5"
              >
                <LogOut className="h-4 w-4" />
                Keluar
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
