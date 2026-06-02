import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageBreadcrumbs } from "@/components/shared/PageBreadcrumbs";
import { PageHeader } from "@/components/shared/PageHeader";
import { getLakipFolders } from "@/lib/lakip/lakip-queries";
import { LakipFolderList } from "@/components/lakip/LakipFolderList";

export const metadata = {
  title: "LAKIP - Pusdatin PU",
  description: "Daftar Dokumen Laporan Akuntabilitas Kinerja Instansi Pemerintah (LAKIP) Pusdatin PU.",
};

export const dynamic = "force-dynamic";

export default async function LakipPage() {
  const headersList = await headers();
  
  const sessionPromise = auth.api.getSession({ headers: headersList }).catch((error) => {
    console.error("Failed to fetch session:", error);
    return null;
  });
  
  const availableFoldersPromise = getLakipFolders();

  const [session, initialFolders] = await Promise.all([sessionPromise, availableFoldersPromise]);

  const isAdmin = session?.user?.role === "admin";

  return (
    <AppLayout user={session?.user ?? null}>
        {/* Breadcrumb Navigation */}
        <PageBreadcrumbs current="LAKIP" />

        <div className="space-y-8 mt-4">
          {/* Header */}
          <PageHeader 
            title="Dokumen LAKIP"
            description="Kelola dan lihat dokumen Laporan Akuntabilitas Kinerja Instansi Pemerintah Pusdatin PU."
          />

          {/* Folder List */}
          <LakipFolderList initialData={initialFolders} isAdmin={isAdmin} />
        </div>
      </AppLayout>
  )
}
