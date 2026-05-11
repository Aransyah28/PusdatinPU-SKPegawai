import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { Navbar } from "@/components/layout/Navbar";
import Link from "next/link"

export const metadata = {
  title: "RKAKL - Pusdatin PU",
  description: "Dokumen Rencana Kerja dan Anggaran (RKAKL) Pusdatin PU",
}

export const dynamic = "force-dynamic";

export default async function RKAKLPage() {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList }).catch((error) => {
    console.error("Failed to fetch session:", error);
    return null;
  });

  // TODO: Replace with actual db query later
  // Mock data for RKAKL available years
  const availableYearsData = [
    { year: 2025, count: 5 },
    { year: 2024, count: 12 },
    { year: 2023, count: 8 },
  ];

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
          <span className="font-black tracking-tight text-primary">RKAKL</span>
        </nav>

        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-headline-lg mb-1">Dokumen RKAKL</h1>
            <p className="text-title-md mt-2 max-w-2xl text-body/80">
              Kelola dan lihat dokumen RKAKL Pusdatin PU berdasarkan tahun.
            </p>
          </div>

          {/* Konten Card Tahun */}
          {availableYearsData.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border bg-muted/30 py-12 text-center">
              <p className="text-body-md text-body/60">Belum ada dokumen RKAKL yang tersedia.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-8">
              {availableYearsData.map((item) => (
                <Link
                  key={item.year}
                  href={`/rkakl/${item.year}`}
                  className="group relative overflow-hidden rounded-4xl border border-border bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:border-primary hover:shadow-2xl hover:shadow-primary/20 active:scale-95 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="relative flex flex-col items-center justify-center p-8 sm:p-12 text-center">
                    <span className="text-title-lg font-bold text-primary">{item.year}</span>
                    <p className="mt-4 inline-flex items-center justify-center rounded-full bg-primary/5 px-4 py-1.5 text-sm font-semibold tracking-wide text-primary/80 sm:text-base">
                      {item.count} Dokumen
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
