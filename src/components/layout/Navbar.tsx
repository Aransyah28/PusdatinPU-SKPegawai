"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Sparkles, Settings } from "lucide-react";
import { signOut } from "@/lib/auth/auth-client";
import { toast } from "sonner";
import { useState, useRef, useEffect } from "react";
import type { User } from "@/lib/auth/auth";

interface NavbarProps {
  user: User | null;
}

function getInitial(name: string): string {
  return name.trim().charAt(0).toUpperCase();
}

/**
 * Navbar redesign sesuai referensi:
 * ← [icon] SK Kepegawaian          [Kelola Admin | ---] Admin [A]
 *
 * - Back arrow → htupusdatin.vercel.app/kepegawaian
 * - Avatar = inisial, klik = popup (email + logout)
 * - Admin: tampilkan "Kelola Admin", separator, label "Admin", lalu avatar
 * - User: tampilkan avatar saja (tanpa separator, tanpa label)
 * - Guest: tombol Masuk & Daftar
 */
export function Navbar({ user }: NavbarProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isAdmin = user?.role === "admin";

  // Tutup dropdown saat klik di luar
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
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-gray-100 bg-white py-2 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">

          {/* Kiri: back arrow + logo + judul */}
          <div className="flex items-center gap-4">
            <a
              href="https://htupusdatin.vercel.app/kepegawaian"
              className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600"
              title="Kembali ke portal kepegawaian"
            >
              <ArrowLeft className="h-5 w-5" />
            </a>

            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 fill-current text-[#1a2f6e]" />
              <span className="text-[17px] font-bold tracking-tight text-[#1a2f6e]">
                SK Kepegawaian
              </span>
            </div>
          </div>

          {/* Kanan: auth section */}
          {user ? (
            <div className="flex items-center gap-6">
              {/* Admin only: Kelola Admin + separator */}
              {isAdmin && (
                <>
                  <Link
                    href="/admin/users"
                    className="flex items-center gap-1.5 text-sm font-medium text-[#1a2f6e] transition-colors hover:text-[#0e1e50]"
                  >
                    <Settings className="h-4 w-4" />
                    <span className="hidden sm:inline">Kelola Admin</span>
                  </Link>
                  <div className="h-5 w-px bg-gray-200" />
                </>
              )}

              {/* Avatar + dropdown popup */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsOpen((v) => !v)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1a2f6e] text-sm font-bold text-white transition-colors hover:bg-[#0e1e50]"
                  aria-label="Menu akun"
                >
                  {getInitial(user.name)}
                </button>

                {/* Popup dropdown */}
                {isOpen && (
                  <div className="absolute right-0 top-11 z-50 w-56 rounded-xl border bg-white p-3 shadow-lg">
                    <div className="mb-3 border-b pb-3">
                      <p className="text-xs font-medium text-gray-400">
                        Akun aktif
                      </p>
                      <p className="mt-0.5 truncate text-sm font-semibold text-gray-800">
                        {user.name}
                      </p>
                      <p className="truncate text-xs text-gray-400">
                        {user.email}
                      </p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-500 transition-colors hover:bg-red-50"
                    >
                      Keluar
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Guest: tombol Masuk & Daftar */
            <div className="flex items-center gap-3">
              <Link
                href="/auth/login"
                className="rounded-md px-4 py-1.5 text-sm text-gray-600 hover:bg-gray-100"
              >
                Masuk
              </Link>
              <Link
                href="/auth/register"
                className="rounded-md bg-[#1a2f6e] px-4 py-1.5 text-sm font-medium text-white hover:bg-[#0e1e50]"
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
