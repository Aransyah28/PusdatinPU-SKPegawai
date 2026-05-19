import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { Navbar } from "@/components/layout/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { Suspense } from "react";
import { getAvailableSopYears } from "@/lib/sops/sop-queries";
import { YearCard } from "@/components/documents/YearCard";
import { PageBreadcrumbs } from "@/components/shared/PageBreadcrumbs";
import { PageHeader } from "@/components/shared/PageHeader";
import { YearCardEmptyState } from "@/components/shared/YearCardEmptyState";
import { YearCardSkeleton } from "@/components/shared/YearCardSkeleton";

const BIDANG_LIST = [
  { id: "mti", nama: "MTI" },
  { id: "bda", nama: "BDA" },
  { id: "pdbi", nama: "PDBI" },
  { id: "tu", nama: "TU" },
]

export const metadata = {
  title: "SOP - Pusdatin PU",
  description: "Standar Operasional Prosedur Pusdatin PU",
}

export const dynamic = "force-dynamic";

export default async function SOPPage() {
  const headersList = await headers();
  const sessionPromise = auth.api.getSession({ headers: headersList }).catch((error) => {
    console.error("Failed to fetch session:", error);
    return null;
  });

  const session = await sessionPromise;

  return (
    <div className="min-h-screen bg-background pt-20">
      <Navbar user={session?.user ?? null} />

      <main className="section-padding mx-auto max-w-[1600px]">
        {/* Breadcrumb Navigation */}
        <PageBreadcrumbs current="SOP" />

        <div className="space-y-8">
          {/* Header */}
          <PageHeader 
            title="Standar Operasional Prosedur"
            description="Kelola dan lihat dokumen SOP Pusdatin PU berdasarkan bidang dan tahun."
          />

          {/* Navigasi Tabs */}
          <Tabs defaultValue={BIDANG_LIST[0].id} className="w-full">
            <TabsList className="flex w-full bg-muted/50 p-1 mb-6">
              {BIDANG_LIST.map((bidang) => (
                <TabsTrigger key={bidang.id} value={bidang.id} className="flex-1 text-label-lg">
                  {bidang.nama}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Konten Card Tahun untuk masing-masing Bidang */}
            {BIDANG_LIST.map((bidang) => (
              <TabsContent key={bidang.id} value={bidang.id} className="mt-0">
                <Suspense fallback={<YearCardSkeleton />}>
                  <SopYearList bidangId={bidang.id} />
                </Suspense>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
    </div>
  );
}

async function SopYearList({ bidangId }: { bidangId: string }) {
  const availableYearsData = await getAvailableSopYears();
  const yearsForBidang = availableYearsData.filter(d => d.bidang.toLowerCase() === bidangId.toLowerCase());

  if (yearsForBidang.length === 0) {
    return <YearCardEmptyState message="Belum ada dokumen SOP yang tersedia untuk bidang ini." />;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8">
      {yearsForBidang.map((item) => (
        <YearCard 
          key={item.year}
          href={`/sop/${bidangId}/${item.year}`}
          year={item.year}
          count={item.count}
        />
      ))}
    </div>
  );
}
