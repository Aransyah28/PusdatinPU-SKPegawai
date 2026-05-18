import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { Navbar } from "@/components/layout/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { getAvailableSopYears } from "@/lib/sops/sop-queries";
import { YearCard } from "@/components/documents/YearCard";

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

  const availableYearsPromise = getAvailableSopYears();

  const [session, availableYearsData] = await Promise.all([
    sessionPromise,
    availableYearsPromise,
  ]);

  return (
    <div className="min-h-screen bg-background pt-20">
      <Navbar user={session?.user ?? null} />

      <main className="section-padding mx-auto max-w-[1600px]">
        {/* Breadcrumb Navigation */}
        <nav className="mb-6 flex items-center gap-2 text-body-sm font-medium text-body/40">
          <a
            href="https://htupusdatin.vercel.app/"
            className="transition-colors hover:text-primary"
          >
            Beranda
          </a>
          <span className="text-slate-300">&gt;</span>
          <span className="font-black tracking-tight text-primary">SOP</span>
        </nav>

        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-headline-lg mb-1">Standar Operasional Prosedur</h1>
            <p className="text-title-md mt-2 max-w-2xl text-body/80">
              Kelola dan lihat dokumen SOP Pusdatin PU berdasarkan bidang dan tahun.
            </p>
          </div>

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
            {BIDANG_LIST.map((bidang) => {
              const yearsForBidang = availableYearsData.filter(d => d.bidang.toLowerCase() === bidang.id.toLowerCase());

              return (
                <TabsContent key={bidang.id} value={bidang.id} className="mt-0">
                  {yearsForBidang.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-border bg-muted/30 py-12 text-center">
                      <p className="text-body-md text-body/60">Belum ada dokumen SOP yang tersedia untuk bidang ini.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {yearsForBidang.map((item) => (
                        <YearCard 
                          key={item.year}
                          href={`/sop/${bidang.id}/${item.year}`}
                          year={item.year}
                          count={item.count}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>
              );
            })}
          </Tabs>
        </div>
      </main>
    </div>
  )
}
