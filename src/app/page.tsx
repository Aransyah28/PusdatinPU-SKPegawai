import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { AppLayout } from "@/components/layout/AppLayout";
import { Suspense } from "react";
import { getAvailableSKPegawaiYears } from "@/lib/documents/document-queries";
import { YearCard } from "@/components/documents/YearCard";
import { PageHeader } from "@/components/shared/PageHeader";
import { YearCardEmptyState } from "@/components/shared/YearCardEmptyState";
import { YearCardSkeleton } from "@/components/shared/YearCardSkeleton";
import { SKPegawaiUploadAction } from "@/components/documents/SKPegawaiUploadAction";

export const metadata = {
  title: "SK Kepegawaian - Pusdatin PU",
  description: "Portal Surat Keterangan Kepegawaian Pusdatin PU.",
};

export const dynamic = "force-dynamic";

export default async function BerandaPage() {
  const headersList = await headers();
  
  // Initiate fetching in parallel to avoid waterfall
  const sessionPromise = auth.api.getSession({ headers: headersList }).catch((error) => {
    console.error("Failed to fetch session:", error);
    return null;
  });
  
  const availableYearsPromise = getAvailableSKPegawaiYears();

  const session = await sessionPromise;
  const isAdmin = session?.user?.role === "admin";

  return (
    <AppLayout user={session?.user ?? null}>
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-body-sm font-medium text-body/40">
          <a
            href="https://htupusdatin.vercel.app/"
            className="transition-colors hover:text-primary"
          >
            Beranda
          </a>
          <span className="text-slate-300">&gt;</span>
          <a
            href="https://htupusdatin.vercel.app/surat-keputusan"
            className="transition-colors hover:text-primary"
          >
            Kepegawaian
          </a>
          <span className="text-slate-300">&gt;</span>
          <span className="font-black tracking-tight text-primary">SK Kepegawaian</span>
        </nav>

        {/* Header halaman */}
        <div className="mb-10 lg:mb-12">
          <PageHeader 
            title="Surat Keterangan Kepegawaian"
            description={isAdmin
              ? "Dashboard pengelola Surat Keterangan Kepegawaian Pusdatin PU"
              : "Akses dan unduh seluruh Surat Keterangan Kepegawaian resmi Pusdatin PU berdasarkan tahun."}
            action={isAdmin ? <SKPegawaiUploadAction /> : undefined}
          />
        </div>

        {/* Konten Card Tahun */}

        <Suspense fallback={<YearCardSkeleton />}>
          <SKPegawaiYearList promise={availableYearsPromise} />
        </Suspense>
      </AppLayout>
  );
}

async function SKPegawaiYearList({ promise }: { promise: Promise<Array<{ year: number; count: number }>> }) {
  const availableYearsData = await promise;

  if (availableYearsData.length === 0) {
    return <YearCardEmptyState message="Belum ada dokumen SK Kepegawaian yang tersedia." />;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8">
      {availableYearsData.map((item) => (
        <YearCard 
          key={item.year}
          href={`/sk-pegawai/${item.year}`}
          year={item.year}
          count={item.count}
        />
      ))}
    </div>
  );
}
