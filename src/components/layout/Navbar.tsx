"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Sparkles, LogOut, Shield } from "lucide-react";
import { signOut } from "@/lib/auth/auth-client";
import { toast } from "sonner";
import { useState, useRef, useEffect } from "react";
import type { User } from "@/lib/auth/auth";
import { cn } from "@/lib/utils/cn";

interface NavbarProps {
  user: User | null;
}

function getInitial(name: string): string {
  return name.trim().charAt(0).toUpperCase();
}

export function Navbar({ user }: NavbarProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    await signOut();
    toast.success("Berhasil keluar.");
    setIsOpen(false);
    router.push("/");
    router.refresh();
  };

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-border bg-white/80 py-2 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">

          {/* Kiri: back arrow + logo + judul */}
          <div className="flex items-center gap-4">
            <a
              href="https://htupusdatin.vercel.app/kepegawaian"
              className="touch-target rounded-full text-body/40 transition-all hover:bg-muted hover:text-body"
              title="Kembali ke portal kepegawaian"
            >
              <ArrowLeft className="h-5 w-5" />
            </a>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl text-primary">
                <Sparkles className="h-6 w-6 fill-current" />
              </div>
              <span className="text-title-lg tracking-tight text-heading">
                SK Kepegawaian
              </span>
            </div>
          </div>

          {/* Kanan: auth section */}
          {user ? (
            <div className="flex items-center gap-6">
              {isAdmin && (
                <>
                  <Link
                    href="/admin/users"
                    className="ml-2 flex items-center gap-1.5 rounded-full border border-accent-blue-foreground/10 bg-blue-50 px-3 py-1.5 text-body-md font-bold text-primary shadow-sm transition-colors hover:bg-accent-blue/80"
                  >
                    <Shield className="h-4 w-4" />
                    <span className="hidden sm:inline">Portal Admin</span>
                  </Link>
                  <div className="hidden h-5 w-px bg-border sm:block" />
                </>
              )}

              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsOpen((v) => !v)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-white shadow-md transition-all hover:scale-105 active:scale-95"
                  aria-label="Menu akun"
                >
                  {getInitial(user.name)}
                </button>

                {isOpen && (
                  <div className="absolute right-0 top-full z-50 mt-2 w-48 origin-top-right overflow-hidden rounded-2xl border border-border bg-white py-1 shadow-xl animate-in fade-in zoom-in duration-200">
                    {/* Header: Nama & Email */}
                    <div className="bg-muted/30 px-4 py-3 border-b border-border">
                      <p className="truncate text-body-md font-bold text-heading">
                        {user.name}
                      </p>
                      <p className="truncate text-label-md text-body/60">
                        {user.email}
                      </p>
                    </div>
                    
                    {/* Logout Button */}
                    <div className="p-1">
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 rounded-full px-3 py-2 text-sm font-bold text-destructive transition-all hover:bg-destructive/5"
                      >
                        <LogOut className="h-4 w-4" />
                        Keluar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/auth/login"
                className="rounded-full px-5 py-2 text-body-md font-bold text-body hover:bg-muted transition-all"
              >
                Masuk
              </Link>
              <Link
                href="/auth/register"
                className="rounded-full bg-primary px-6 py-2 text-body-md font-bold text-white shadow-md transition-all hover:bg-primary/90 active:scale-95"
              >
                Daftar
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
