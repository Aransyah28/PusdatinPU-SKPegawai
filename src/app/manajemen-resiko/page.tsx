import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageBreadcrumbs } from "@/components/shared/PageBreadcrumbs";
import { ReportLandingSection } from "@/components/reports/ReportLandingSection";

export const metadata = {
  title: "Manajemen Resiko - Pusdatin PU",
  description: "Daftar Manajemen Resiko Pusdatin PU berdasarkan tahun.",
};

export const dynamic = "force-dynamic";

export default async function ManajemenResikoPage() {
  const headersList = await headers();
  
  const sessionPromise = auth.api.getSession({ headers: headersList }).catch((error) => {
    console.error("Failed to fetch session:", error);
    return null;
  });

  const session = await sessionPromise;
  const isAdmin = session?.user?.role === "admin";

  return (
    <AppLayout user={session?.user ?? null}>
        <PageBreadcrumbs current="Manajemen Resiko" />

        <div className="space-y-8">
          <ReportLandingSection
            title="Dokumen Manajemen Resiko"
            description="Kelola dan lihat dokumen Manajemen Resiko Pusdatin PU berdasarkan tahun."
            reportType="manajemen-resiko"
            baseUrl="/manajemen-resiko"
            isAdmin={!!isAdmin}
          />
        </div>
      </AppLayout>
  )
}
