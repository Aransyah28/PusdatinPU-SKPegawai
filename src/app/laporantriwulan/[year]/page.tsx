import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { Navbar } from "@/components/layout/Navbar";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

interface LaporanTriwulanYearPageProps {
  params: Promise<{ year: string }>;
}

export default async function LaporanTriwulanYearPage({
  params,
}: LaporanTriwulanYearPageProps) {
  const { year } = await params;
  let session = null;

  try {
    session = await auth.api.getSession({ headers: await headers() });
  } catch (error) {
    console.error("Failed to fetch session:", error);
  }

  const isAdmin = session?.user?.role === "admin";

  return (
    <div className="min-h-screen bg-background pt-20">
      <Navbar user={session?.user ?? null} />

      <main className="section-padding mx-auto max-w-[1600px]">
        <div className="mb-6 flex items-center gap-3">
          <Link
            href="/laporantriwulan"
            className="touch-target rounded-full text-body/40 transition-all hover:bg-muted hover:text-body"
            title="Kembali ke pilih tahun"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <nav className="flex items-center gap-2 text-body-sm font-medium text-body/40">
            <a
              href="https://htupusdatin.vercel.app/"
              className="transition-colors hover:text-primary"
            >
              Home
            </a>
            <span className="text-slate-300;">&gt;</span>
            <Link
              href="/laporantriwulan"
              className="transition-colors hover:text-primary"
            >
              Laporan Triwulan
            </Link>
            <span className="text-slate-300;">&gt;</span>
            <span className="font-black tracking-tight text-primary">{year}</span>
          </nav>
        </div>

        <div className="mb-10 lg:mb-12">
          <h1 className="text-headline-lg mb-1">Laporan Triwulan {year}</h1>
          <p className="text-title-md mt-2 max-w-2xl text-body/80">
            Berikut adalah daftar laporan triwulan Pusdatin PU untuk tahun {year}.
          </p>
        </div>

        {/* Placeholder untuk DocumentsSection dengan filter year */}
        <div className="rounded-lg border border-dashed border-border bg-muted/30 py-12 text-center">
          <p className="text-body-md text-body/60">
            Konten laporan triwulan tahun {year} akan ditampilkan di sini.
          </p>
        </div>
      </main>
    </div>
  );
}
