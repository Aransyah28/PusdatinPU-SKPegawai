import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { AppLayout } from "@/components/layout/AppLayout";
import { ReportLandingSection } from "@/components/reports/ReportLandingSection";
import { PageBreadcrumbs } from "@/components/shared/PageBreadcrumbs";

export const metadata = {
  title: "Laporan Bulanan - Pusdatin PU",
  description: "Daftar laporan bulanan Pusdatin PU berdasarkan tahun.",
};

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
    <AppLayout user={session?.user ?? null}>
        <PageBreadcrumbs current="Laporan Bulanan" />

        <ReportLandingSection
          title="Laporan Bulanan"
          description="Pilih tahun untuk melihat laporan bulanan Pusdatin PU yang tersedia."
          reportType="bulanan"
          baseUrl="/laporanbulanan"
          isAdmin={isAdmin}
        />
      </AppLayout>
  );
}
