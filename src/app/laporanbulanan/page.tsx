import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { Navbar } from "@/components/layout/Navbar";
import { YearSelector } from "@/components/reports/YearSelector";

export const dynamic = "force-dynamic";

export default async function LaporanBulananPage() {
  let session = null;

  try {
    session = await auth.api.getSession({ headers: await headers() });
  } catch (error) {
    console.error("Failed to fetch session:", error);
  }

  const isAdmin = session?.user?.role === "admin";

  return (
    <div className="min-h-screen bg-background pt-20">
      <Navbar user={session?.user ?? null} />

      <main className="section-padding mx-auto max-w-[1600px]">
        <nav className="mb-6 flex items-center gap-2 text-body-sm font-medium text-body/40">
          <a
            href="https://htupusdatin.vercel.app/"
            className="transition-colors hover:text-primary"
          >
            Home
          </a>
          <span className="text-slate-300;">&gt;</span>
          <span className="font-black tracking-tight text-primary">Laporan Bulanan</span>
        </nav>

        <div className="mb-10 lg:mb-12">
          <h1 className="text-headline-lg mb-1">Laporan Bulanan</h1>
          <p className="text-title-md mt-2 max-w-2xl text-body/80">
            Pilih tahun untuk melihat laporan bulanan Pusdatin PU yang tersedia.
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-title-lg font-bold mb-4">Pilih Tahun</h2>
          <YearSelector reportType="bulanan" baseUrl="/laporanbulanan" />
        </div>
      </main>
    </div>
  );
}
