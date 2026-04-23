"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { ArrowLeft, Sparkles, LogOut, Shield, Menu, X } from "lucide-react";
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

function getTitleFromPathname(pathname: string): string {
  // Handle dynamic routes like /laporanbulanan/2026
  const yearMatch = pathname.match(/^\/(laporan\w+)\/(\d+)$/);
  if (yearMatch) {
    const [, reportType, year] = yearMatch;
    const typeMap: Record<string, string> = {
      laporanbulanan: "Laporan Bulanan",
      laporankinerja: "Laporan Kinerja",
      laporanmingguan: "Laporan Mingguan",
      laporantriwulan: "Laporan Triwulan",
    };
    const title = typeMap[reportType] || "Laporan";
    return `${title} ${year}`;
  }

  const pathMap: Record<string, string> = {
    "/": "Surat Keterangan Kepegawaian",
    "/admin/users": "Kelola Pengguna",
    "/laporanbulanan": "Laporan Bulanan",
    "/laporankinerja": "Laporan Kinerja",
    "/laporanmingguan": "Laporan Mingguan",
    "/laporantriwulan": "Laporan Triwulan",
  };

  return pathMap[pathname] || "Surat Keterangan Kepegawaian";
}

export function Navbar({ user }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isAdmin = user?.role === "admin";
  const pageTitle = getTitleFromPathname(pathname);

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
    setIsSidebarOpen(false);
    router.push("/");
    router.refresh();
  };

  return (
    <>
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
              <span className="text-title-lg">
                {pageTitle}
              </span>
            </div>
          </div>

          {/* Menu Kanan (Desktop & Tablet) */}
          <div className="hidden sm:flex items-center gap-4">
            {user ? (
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

          {/* Menu Hamburger (Mobile) */}
          <div className="flex sm:hidden">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-body transition-all hover:bg-muted"
              aria-label="Buka menu navigasi"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>

      {/* Sidebar Mobile */}
      {isSidebarOpen && (
        <div className="sm:hidden">
          {/* Overlay */}
          <div
            className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm animate-in fade-in"
            onClick={() => setIsSidebarOpen(false)}
          />

          {/* Sidebar Panel */}
          <div className="fixed inset-y-0 right-0 z-50 w-[75%] max-w-[260px] border-l border-border bg-card shadow-2xl animate-in slide-in-from-right">
            <div className="flex items-center justify-between p-3 pb-1">
              <span className="text-title-md font-bold">Menu</span>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-body transition-all hover:bg-muted"
                aria-label="Tutup menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-col p-3 gap-3">
              {user ? (
                <>
                  {/* Account Info */}
                  <div className="flex items-center gap-2.5 px-1 py-1">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-title-sm text-white shadow-sm">
                      {getInitial(user.name)}
                    </div>
                    <div className="flex min-w-0 flex-col">
                      <p className="truncate text-body-md font-bold text-heading">
                        {user.name}
                      </p>
                      <p className="truncate text-label-md text-body/60">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="my-1.5 h-[1px] w-full rounded-full bg-primary" />

                  {/* Navigation Links */}
                  <div className="flex flex-col gap-1.5">
                    {isAdmin && (
                      <Link
                        href="/admin/users"
                        onClick={() => setIsSidebarOpen(false)}
                        className="flex w-full items-center justify-center gap-2 rounded-full border border-accent-blue-foreground/10 bg-blue-50 px-3 py-2 text-body-sm font-bold text-primary shadow-sm transition-colors hover:bg-accent-blue/80"
                      >
                        <Shield className="h-4 w-4" />
                        Portal Admin
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
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
                    onClick={() => setIsSidebarOpen(false)}
                    className="flex w-full items-center justify-center rounded-full border border-border px-4 py-2 text-body-sm font-bold text-body transition-all hover:bg-muted"
                  >
                    Masuk
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={() => setIsSidebarOpen(false)}
                    className="flex w-full items-center justify-center rounded-full bg-primary px-4 py-2 text-body-sm font-bold text-white shadow-md transition-all hover:bg-primary/90"
                  >
                    Daftar
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
