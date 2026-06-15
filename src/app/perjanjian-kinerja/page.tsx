import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageBreadcrumbs } from "@/components/shared/PageBreadcrumbs";
import { ReportLandingSection } from "@/components/reports/ReportLandingSection";

export const metadata = {
  title: "Perjanjian Kinerja - Pusdatin PU",
  description: "Daftar Perjanjian Kinerja Pusdatin PU berdasarkan tahun.",
};

export const dynamic = "force-dynamic";

export default async function PerjanjianKinerjaPage() {
  const headersList = await headers();
  
  const sessionPromise = auth.api.getSession({ headers: headersList }).catch((error) => {
    console.error("Failed to fetch session:", error);
    return null;
  });

  const session = await sessionPromise;
  const isAdmin = session?.user?.role === "admin";

  return (
    <AppLayout user={session?.user ?? null}>
        <PageBreadcrumbs current="Perjanjian Kinerja" />

        <div className="space-y-8">
          <ReportLandingSection
            title="Dokumen Perjanjian Kinerja"
            description="Kelola dan lihat dokumen Perjanjian Kinerja Pusdatin PU berdasarkan tahun."
            reportType="perjanjian-kinerja"
            baseUrl="/perjanjian-kinerja"
            isAdmin={!!isAdmin}
          />
        </div>
      </AppLayout>
  )
}
