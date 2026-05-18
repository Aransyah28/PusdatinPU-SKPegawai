import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { Navbar } from "@/components/layout/Navbar";
import Link from "next/link";
import { getAvailableLaporanKeuanganYears } from "@/lib/laporan-keuangan/laporan-keuangan-queries";
import { YearCard } from "@/components/documents/YearCard";

export const metadata = {
  title: "Laporan Keuangan - Pusdatin PU",
  description: "Daftar Laporan Keuangan Pusdatin PU berdasarkan tahun.",
};

export const dynamic = "force-dynamic";

export default async function LaporanKeuanganPage() {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList }).catch((error) => {
    console.error("Failed to fetch session:", error);
    return null;
  });

  const availableYearsData = await getAvailableLaporanKeuanganYears();

  return (
    <div className="min-h-screen bg-background pt-20">
      <Navbar user={session?.user ?? null} />

      <main className="section-padding mx-auto max-w-[1600px]">
        {/* Breadcrumb Navigation */}
        <nav className="mb-6 flex items-center gap-2 text-body-sm font-medium text-body/40">
          <a
            href="https://htupusdatin.vercel.app/"
            className="transition-colors hover:text-primary"
          >
            Beranda
          </a>
          <span className="text-slate-300">&gt;</span>
          <span className="font-black tracking-tight text-primary">Laporan Keuangan</span>
        </nav>

        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-headline-lg mb-1">Dokumen Laporan Keuangan</h1>
            <p className="text-title-md mt-2 max-w-2xl text-body/80">
              Kelola dan lihat dokumen Laporan Keuangan Pusdatin PU berdasarkan tahun.
            </p>
          </div>

          {/* Konten Card Tahun */}
          {availableYearsData.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border bg-muted/30 py-12 text-center">
              <p className="text-body-md text-body/60">Belum ada dokumen Laporan Keuangan yang tersedia.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8">
              {availableYearsData.map((item) => (
                <YearCard 
                  key={item.year}
                  href={`/laporan-keuangan/${item.year}`}
                  year={item.year}
                  count={item.count}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
