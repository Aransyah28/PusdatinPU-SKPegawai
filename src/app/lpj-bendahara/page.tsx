import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { Navbar } from "@/components/layout/Navbar";
import Link from "next/link";
import { getAvailableLpjBendaharaYears } from "@/lib/lpj-bendahara/lpj-bendahara-queries";
import { YearCard } from "@/components/documents/YearCard";
import { PageBreadcrumbs } from "@/components/shared/PageBreadcrumbs";
import { PageHeader } from "@/components/shared/PageHeader";
import { YearCardEmptyState } from "@/components/shared/YearCardEmptyState";

export const metadata = {
  title: "LPJ Bendahara - Pusdatin PU",
  description: "Daftar LPJ Bendahara Pusdatin PU berdasarkan tahun.",
};

export const dynamic = "force-dynamic";

export default async function LpjBendaharaPage() {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList }).catch((error) => {
    console.error("Failed to fetch session:", error);
    return null;
  });

  const availableYearsData = await getAvailableLpjBendaharaYears();

  return (
    <div className="min-h-screen bg-background pt-20">
      <Navbar user={session?.user ?? null} />

      <main className="section-padding mx-auto max-w-[1600px]">
        {/* Breadcrumb Navigation */}
        <PageBreadcrumbs current="LPJ Bendahara" />

        <div className="space-y-8">
          {/* Header */}
          <PageHeader 
            title="Dokumen LPJ Bendahara"
            description="Kelola dan lihat dokumen LPJ Bendahara Pusdatin PU berdasarkan tahun."
          />

          {/* Konten Card Tahun */}
          {availableYearsData.length === 0 ? (
            <YearCardEmptyState message="Belum ada dokumen LPJ Bendahara yang tersedia." />
          ) : (
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
          )}
        </div>
      </main>
    </div>
  )
}
