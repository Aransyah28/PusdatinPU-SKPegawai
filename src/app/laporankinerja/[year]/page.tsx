import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { Navbar } from "@/components/layout/Navbar";
import Link from "next/link";
import { notFound } from "next/navigation";
import { YearReportDocumentsTable } from "@/components/reports/YearReportDocumentsTable";
import { getReportDocumentsByYear } from "@/lib/reports/report-queries";

export const dynamic = "force-dynamic";

interface LaporanKinerjaYearPageProps {
  params: Promise<{ year: string }>;
}

export default async function LaporanKinerjaYearPage({
  params,
}: LaporanKinerjaYearPageProps) {
  const { year } = await params;
  const yearNumber = Number.parseInt(year, 10);

  if (Number.isNaN(yearNumber)) {
    notFound();
  }

  let fetchError = false;
  const [session, reportDocuments] = await Promise.all([
    headers().then((h) => auth.api.getSession({ headers: h })).catch((error) => {
      console.error("Failed to fetch session:", error);
      return null;
    }),
    getReportDocumentsByYear("kinerja", yearNumber).catch((error) => {
      console.error("Failed to fetch laporan kinerja:", error);
      fetchError = true;
      return [];
    }),
  ]);

  return (
    <div className="min-h-screen bg-background pt-20">
      <Navbar user={session?.user ?? null} />

      <main className="section-padding mx-auto max-w-[1600px]">
        <div className="mb-6 flex items-center gap-3">
          <nav className="flex items-center gap-2 text-body-sm font-medium text-body/40">
            <a
              href="https://htupusdatin.vercel.app/"
              className="transition-colors hover:text-primary"
            >
              Home
            </a>
            <span className="text-slate-300;">&gt;</span>
            <Link
              href="/laporankinerja"
              className="transition-colors hover:text-primary"
            >
              Laporan Kinerja
            </Link>
            <span className="text-slate-300;">&gt;</span>
            <span className="font-black tracking-tight text-primary">{year}</span>
          </nav>
        </div>

        <div className="mb-10 lg:mb-12">
          <h1 className="text-headline-lg mb-1">Laporan Kinerja {year}</h1>
          <p className="text-title-md mt-2 max-w-2xl text-body/80">
            Berikut adalah daftar laporan kinerja Pusdatin PU untuk tahun {year}.
          </p>
        </div>

        {fetchError ? (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center">
            <p className="text-label-lg text-destructive">
              Gagal memuat data laporan. Silakan muat ulang halaman.
            </p>
          </div>
        ) : (
          <YearReportDocumentsTable 
            documents={reportDocuments}
            isAdmin={session?.user?.role === "admin"}
            reportType="kinerja"
            year={yearNumber}
          />
        )}
      </main>
    </div>
  );
}
