import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { Navbar } from "@/components/layout/Navbar";
import Link from "next/link"
import { Suspense } from "react";
import { getAvailableRkaklYears } from "@/lib/rkakl/rkakl-queries";
import { YearCard } from "@/components/documents/YearCard";
import { PageBreadcrumbs } from "@/components/shared/PageBreadcrumbs";
import { PageHeader } from "@/components/shared/PageHeader";
import { YearCardEmptyState } from "@/components/shared/YearCardEmptyState";
import { YearCardSkeleton } from "@/components/shared/YearCardSkeleton";

export const metadata = {
  title: "RKAKL - Pusdatin PU",
  description: "Daftar Rencana Kerja dan Anggaran (RKAKL) Pusdatin PU berdasarkan tahun.",
};

export const dynamic = "force-dynamic";

export default async function RKAKLPage() {
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
        <PageBreadcrumbs current="RKAKL" />

        <div className="space-y-8">
          {/* Header */}
          <PageHeader 
            title="Dokumen RKAKL"
            description="Kelola dan lihat dokumen RKAKL Pusdatin PU berdasarkan tahun."
          />

          {/* Konten Card Tahun */}
          <Suspense fallback={<YearCardSkeleton />}>
            <RkaklYearList />
          </Suspense>
        </div>
      </main>
    </div>
  )
}

async function RkaklYearList() {
  const availableYearsData = await getAvailableRkaklYears();

  if (availableYearsData.length === 0) {
    return <YearCardEmptyState message="Belum ada dokumen RKAKL yang tersedia." />;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8">
      {availableYearsData.map((item) => (
        <YearCard 
          key={item.year}
          href={`/rkakl/${item.year}`}
          year={item.year}
          count={item.count}
        />
      ))}
    </div>
  );
}
