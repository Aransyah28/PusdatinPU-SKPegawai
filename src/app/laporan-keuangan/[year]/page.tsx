import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { AppLayout } from "@/components/layout/AppLayout";
import { LaporanKeuanganDocumentsTable } from "@/components/laporan-keuangan/LaporanKeuanganDocumentsTable";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { LaporanKeuanganUploadAction } from "@/components/laporan-keuangan/LaporanKeuanganUploadAction";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps) {
  const { year } = await params;
  return {
    title: `Laporan Keuangan ${year} - Pusdatin PU`,
    description: `Daftar Laporan Keuangan Pusdatin PU untuk tahun ${year}.`,
  };
}

interface PageProps {
  params: Promise<{ year: string }>;
}

export default async function LaporanKeuanganYearPage({ params }: PageProps) {
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
        {/* Breadcrumb Navigation */}
        <div className="mb-6 flex items-center gap-3">
          <nav className="flex items-center gap-2 text-body-sm font-medium text-body/40">
            <a
              href="https://htupusdatin.vercel.app/"
              className="transition-colors hover:text-primary"
            >
              Beranda
            </a>
            <span className="text-slate-300">&gt;</span>
            <Link href="/laporan-keuangan" className="transition-colors hover:text-primary">
              Laporan Keuangan
            </Link>
            <span className="text-slate-300">&gt;</span>
            <span className="font-black tracking-tight text-primary">{year}</span>
          </nav>
        </div>

        <div className="mb-10 lg:mb-12">
          <PageHeader
            title={`Laporan Keuangan Tahun ${year}`}
            description={`Berikut adalah daftar dokumen Laporan Keuangan Pusdatin PU untuk tahun ${year}.`}
            action={isAdmin ? <LaporanKeuanganUploadAction /> : undefined}
          />
        </div>

        <LaporanKeuanganDocumentsTable year={year} isAdmin={isAdmin} />
      </AppLayout>
  );
}
