import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { Navbar } from "@/components/layout/Navbar";
import { ReportLandingSection } from "@/components/reports/ReportLandingSection";

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

        <ReportLandingSection
          title="Laporan Bulanan"
          description="Pilih tahun untuk melihat laporan bulanan Pusdatin PU yang tersedia."
          reportType="bulanan"
          baseUrl="/laporanbulanan"
          isAdmin={isAdmin}
        />
      </main>
    </div>
  );
}
