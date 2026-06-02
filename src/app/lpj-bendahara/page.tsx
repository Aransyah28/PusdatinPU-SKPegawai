import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { AppLayout } from "@/components/layout/AppLayout";
import Link from "next/link";
import { Suspense } from "react";
import { getAvailableLpjBendaharaYears } from "@/lib/lpj-bendahara/lpj-bendahara-queries";
import { YearCard } from "@/components/documents/YearCard";
import { PageBreadcrumbs } from "@/components/shared/PageBreadcrumbs";
import { PageHeader } from "@/components/shared/PageHeader";
import { YearCardEmptyState } from "@/components/shared/YearCardEmptyState";
import { YearCardSkeleton } from "@/components/shared/YearCardSkeleton";

export const metadata = {
  title: "LPJ Bendahara - Pusdatin PU",
  description: "Daftar LPJ Bendahara Pusdatin PU berdasarkan tahun.",
};

export const dynamic = "force-dynamic";

export default async function LpjBendaharaPage() {
  const headersList = await headers();
  
  // Initiate fetching in parallel to avoid waterfall
  const sessionPromise = auth.api.getSession({ headers: headersList }).catch((error) => {
    console.error("Failed to fetch session:", error);
    return null;
  });
  
  const availableYearsPromise = getAvailableLpjBendaharaYears();

  const session = await sessionPromise;

  return (
    <AppLayout user={session?.user ?? null}>
        {/* Breadcrumb Navigation */}
        <PageBreadcrumbs current="LPJ Bendahara" />

        <div className="space-y-8">
          {/* Header */}
          <PageHeader 
            title="Dokumen LPJ Bendahara"
            description="Kelola dan lihat dokumen LPJ Bendahara Pusdatin PU berdasarkan tahun."
          />

          {/* Konten Card Tahun */}
          <Suspense fallback={<YearCardSkeleton />}>
            <LpjBendaharaYearList promise={availableYearsPromise} />
          </Suspense>
        </div>
      </AppLayout>
  );
}

async function LpjBendaharaYearList({ promise }: { promise: Promise<Array<{ year: number; count: number }>> }) {
  const availableYearsData = await promise;

  if (availableYearsData.length === 0) {
    return <YearCardEmptyState message="Belum ada dokumen LPJ Bendahara yang tersedia." />;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8">
      {availableYearsData.map((item) => (
        <YearCard 
          key={item.year}
          href={`/lpj-bendahara/${item.year}`}
          year={item.year}
          count={item.count}
        />
      ))}
    </div>
  );
}
