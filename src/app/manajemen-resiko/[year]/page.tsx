import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { AppLayout } from "@/components/layout/AppLayout";
import { YearReportDocumentsTable } from "@/components/reports/YearReportDocumentsTable";
import { PageHeader } from "@/components/shared/PageHeader";

interface ManajemenResikoYearPageProps {
  params: Promise<{
    year: string;
  }>;
}

export async function generateMetadata({ params }: ManajemenResikoYearPageProps) {
  const resolvedParams = await params;
  return {
    title: `Manajemen Resiko ${resolvedParams.year} - Pusdatin PU`,
    description: `Daftar dokumen Manajemen Resiko Pusdatin PU tahun ${resolvedParams.year}.`,
  };
}

export default async function ManajemenResikoYearPage({ params }: ManajemenResikoYearPageProps) {
  const resolvedParams = await params;
  const year = resolvedParams.year;
  const yearNumber = Number.parseInt(year, 10);
  
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
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
            <a href="/manajemen-resiko" className="transition-colors hover:text-primary">
              Manajemen Resiko
            </a>
            <span className="text-slate-300">&gt;</span>
            <span className="font-black tracking-tight text-primary">{year}</span>
          </nav>
        </div>

      <div className="space-y-8 mt-6">
        <PageHeader 
          title={`Manajemen Resiko Tahun ${year}`}
          description={`Kelola dan lihat dokumen Manajemen Resiko untuk tahun ${year}.`}
        />

        {!Number.isNaN(yearNumber) && (
          <YearReportDocumentsTable 
            year={yearNumber} 
            reportType="manajemen-resiko"
            isAdmin={!!isAdmin} 
          />
        )}
      </div>
    </AppLayout>
  );
}
