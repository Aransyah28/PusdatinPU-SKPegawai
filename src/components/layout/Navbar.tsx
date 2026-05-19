"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { ArrowLeft, Sparkles, Menu } from "lucide-react";
import { signOut } from "@/lib/auth/auth-client";
import { toast } from "sonner";
import { useState } from "react";
import type { User } from "@/lib/auth/auth";
import { getTitleFromPathname } from "@/lib/utils/navbar-utils";
import { NavbarUserDropdown } from "./NavbarUserDropdown";
import { NavbarMobileSidebar } from "./NavbarMobileSidebar";

interface NavbarProps {
  user: User | null;
}

export function Navbar({ user }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isAdmin = user?.role === "admin";
  const pageTitle = getTitleFromPathname(pathname);
  const isSubPage =
    pathname.match(/^\/(laporan\w+|rkakl|laporan-keuangan|lpj-bendahara)\/(\d+)$/) ||
    pathname.match(/^\/sop\/([^/]+)\/(\d+)$/);

  const handleLogout = async () => {
    await signOut();
    toast.success("Berhasil keluar.");
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
              {isSubPage ? (
                <Link
                  href={`/${pathname.split("/")[1]}`}
                  className="touch-target rounded-full text-body/40 transition-all hover:bg-muted hover:text-body"
                  title="Kembali ke pemilihan tahun"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              ) : (
                <a
                  href="https://htupusdatin.vercel.app/kepegawaian"
                  className="touch-target rounded-full text-body/40 transition-all hover:bg-muted hover:text-body"
                  title="Kembali ke portal kepegawaian"
                >
                  <ArrowLeft className="h-5 w-5" />
                </a>
              )}

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl text-primary">
                  <Sparkles className="h-6 w-6 fill-current" />
                </div>
                <span className="text-title-lg">{pageTitle}</span>
              </div>
            </div>

            {/* Menu Kanan (Desktop & Tablet) */}
            <div className="hidden items-center gap-4 sm:flex">
              {user ? (
                <NavbarUserDropdown
                  user={user}
                  isAdmin={!!isAdmin}
                  onLogout={handleLogout}
                />
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    href="/auth/login"
                    className="rounded-full px-5 py-2 text-body-md font-bold text-body transition-all hover:bg-muted"
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

      <NavbarMobileSidebar
        user={user}
        isAdmin={!!isAdmin}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onLogout={handleLogout}
      />
    </>
  );
}

