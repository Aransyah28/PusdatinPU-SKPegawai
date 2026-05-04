import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { Navbar } from "@/components/layout/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

// Data statis untuk Bidang
const BIDANG_LIST = [
  { id: "mti", nama: "MTI" },
  { id: "bda", nama: "BDA" },
  { id: "pdbi", nama: "PDBI" },
  { id: "tu", nama: "TU" },
]

const currentYear = new Date().getFullYear()
// Buat daftar tahun dari tahun ini mundur ke 5 tahun ke belakang
const TAHUN_LIST = Array.from({ length: 5 }, (_, i) => (currentYear - i).toString())

export const metadata = {
  title: "SOP - Pusdatin PU",
  description: "Standar Operasional Prosedur Pusdatin PU",
}

export const dynamic = "force-dynamic";

export default async function SOPPage() {
  let session = null;

  try {
    session = await auth.api.getSession({ headers: await headers() });
  } catch (error) {
    console.error("Failed to fetch session:", error);
  }

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
            Home
          </a>
          <span className="text-slate-300">&gt;</span>
          <span className="font-black tracking-tight text-primary">SOP</span>
        </nav>

        <div className="space-y-8 max-w-5xl">
          {/* Header */}
          <div>
            <h1 className="text-headline-sm">Standar Operasional Prosedur (SOP)</h1>
            <p className="text-body-md mt-2 text-muted-foreground">
              Kelola dan lihat dokumen SOP Pusdatin PU berdasarkan bidang dan tahun.
            </p>
          </div>

          {/* Navigasi Tabs */}
          <Tabs defaultValue={BIDANG_LIST[0].id} className="w-full">
            <TabsList className="w-full sm:w-auto inline-flex justify-start overflow-x-auto bg-muted/50 p-1 mb-6 scrollbar-hide">
              {BIDANG_LIST.map((bidang) => (
                <TabsTrigger key={bidang.id} value={bidang.id} className="min-w-[100px] text-label-lg">
                  {bidang.nama}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Konten Card Tahun untuk masing-masing Bidang */}
            {BIDANG_LIST.map((bidang) => (
              <TabsContent key={bidang.id} value={bidang.id} className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {TAHUN_LIST.map((tahun) => (
                    <Link
                      key={tahun}
                      href={`/sop/${bidang.id}/${tahun}`}
                      className="group relative overflow-hidden rounded-3xl border border-border bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:border-primary hover:shadow-2xl hover:shadow-primary/20 active:scale-95"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      <div className="relative flex flex-col items-center justify-center p-8 sm:p-12 text-center">
                        <span className="text-title-lg font-bold text-primary">{tahun}</span>
                        <p className="mt-4 inline-flex items-center justify-center rounded-full bg-primary/5 px-4 py-1.5 text-sm font-semibold tracking-wide text-primary/80 sm:text-base">
                          Lihat Dokumen
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
    </div>
  )
}
