import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { Navbar } from "@/components/layout/Navbar";
import Link from "next/link";
import { Suspense } from "react";
import { getAvailableLaporanKeuanganYears } from "@/lib/laporan-keuangan/laporan-keuangan-queries";
import { YearCard } from "@/components/documents/YearCard";
import { PageBreadcrumbs } from "@/components/shared/PageBreadcrumbs";
import { PageHeader } from "@/components/shared/PageHeader";
import { YearCardEmptyState } from "@/components/shared/YearCardEmptyState";
import { YearCardSkeleton } from "@/components/shared/YearCardSkeleton";

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

  return (
    <div className="min-h-screen bg-background pt-20">
      <Navbar user={session?.user ?? null} />

      <main className="section-padding mx-auto max-w-[1600px]">
        {/* Breadcrumb Navigation */}
        <PageBreadcrumbs current="Laporan Keuangan" />

        <div className="space-y-8">
          {/* Header */}
          <PageHeader 
            title="Dokumen Laporan Keuangan"
            description="Kelola dan lihat dokumen Laporan Keuangan Pusdatin PU berdasarkan tahun."
          />

          {/* Konten Card Tahun */}
          <Suspense fallback={<YearCardSkeleton />}>
            <LaporanKeuanganYearList />
          </Suspense>
        </div>
      </main>
    </div>
  )
}

async function LaporanKeuanganYearList() {
  const availableYearsData = await getAvailableLaporanKeuanganYears();

  if (availableYearsData.length === 0) {
    return <YearCardEmptyState message="Belum ada dokumen Laporan Keuangan yang tersedia." />;
  }

  return (
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
  );
}
