import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { AppLayout } from "@/components/layout/AppLayout";
import Link from "next/link";
import { notFound } from "next/navigation";
import { YearReportDocumentsTable } from "@/components/reports/YearReportDocumentsTable";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps) {
  const { year } = await params;
  return {
    title: `Laporan Kinerja ${year} - Pusdatin PU`,
    description: `Daftar laporan kinerja Pusdatin PU untuk tahun ${year}.`,
  };
}

interface PageProps {
  params: Promise<{ year: string }>;
}

export default async function LaporanKinerjaYearPage({
  params,
}: PageProps) {
  const { year } = await params;
  const yearNumber = Number.parseInt(year, 10);

  if (Number.isNaN(yearNumber)) {
    notFound();
  }

  const session = await headers()
    .then((h) => auth.api.getSession({ headers: h }))
    .catch(() => null);

  const isAdmin = session?.user?.role === "admin";

  return (
    <AppLayout user={session?.user ?? null}>
        <div className="mb-6 flex items-center gap-3">
          <nav className="flex items-center gap-2 text-body-sm font-medium text-body/40">
            <a
              href="https://htupusdatin.vercel.app/"
              className="transition-colors hover:text-primary"
            >
              Beranda
            </a>
            <span className="text-slate-300">&gt;</span>
            <Link
              href="/laporankinerja"
              className="transition-colors hover:text-primary"
            >
              Laporan Kinerja
            </Link>
            <span className="text-slate-300">&gt;</span>
            <span className="font-black tracking-tight text-primary">{year}</span>
          </nav>
        </div>

        <div className="mb-10 lg:mb-12">
          <h1 className="text-headline-lg mb-1">Laporan Kinerja {year}</h1>
          <p className="text-title-md mt-2 max-w-2xl text-body/80">
            Berikut adalah daftar laporan kinerja Pusdatin PU untuk tahun {year}.
          </p>
        </div>

        <YearReportDocumentsTable 
          isAdmin={isAdmin}
          reportType="kinerja"
          year={yearNumber}
        />
      </AppLayout>
  );
}
