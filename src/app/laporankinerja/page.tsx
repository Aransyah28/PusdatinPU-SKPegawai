import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { Navbar } from "@/components/layout/Navbar";
import { ReportLandingSection } from "@/components/reports/ReportLandingSection";
import { PageBreadcrumbs } from "@/components/shared/PageBreadcrumbs";

export const metadata = {
  title: "Laporan Kinerja - Pusdatin PU",
  description: "Daftar laporan kinerja Pusdatin PU berdasarkan tahun.",
};

export const dynamic = "force-dynamic";

export default async function LaporanKinerjaPage() {
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
        <PageBreadcrumbs current="Laporan Kinerja" />

        <ReportLandingSection
          title="Laporan Kinerja"
          description="Pilih tahun untuk melihat laporan kinerja Pusdatin PU yang tersedia."
          reportType="kinerja"
          baseUrl="/laporankinerja"
          isAdmin={isAdmin}
        />
      </main>
    </div>
  );
}
