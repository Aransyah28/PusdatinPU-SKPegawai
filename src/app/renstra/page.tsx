import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { Navbar } from "@/components/layout/Navbar";
import { PageBreadcrumbs } from "@/components/shared/PageBreadcrumbs";
import { PageHeader } from "@/components/shared/PageHeader";
import { getRenstraFolders } from "@/lib/renstra/renstra-queries";
import { RenstraFolderList } from "@/components/renstra/RenstraFolderList";

export const metadata = {
  title: "Renstra - Pusdatin PU",
  description: "Daftar Dokumen Rencana Strategis (Renstra) Pusdatin PU.",
};

export const dynamic = "force-dynamic";

export default async function RenstraPage() {
  const headersList = await headers();
  
  const sessionPromise = auth.api.getSession({ headers: headersList }).catch((error) => {
    console.error("Failed to fetch session:", error);
    return null;
  });
  
  const availableFoldersPromise = getRenstraFolders();

  const [session, initialFolders] = await Promise.all([sessionPromise, availableFoldersPromise]);

  const isAdmin = session?.user?.role === "admin";

  return (
    <div className="min-h-screen bg-background pt-20">
      <Navbar user={session?.user ?? null} />

      <main className="section-padding mx-auto max-w-[1600px]">
        {/* Breadcrumb Navigation */}
        <PageBreadcrumbs current="Renstra" />

        <div className="space-y-8 mt-4">
          {/* Header */}
          <PageHeader 
            title="Dokumen Renstra"
            description="Kelola dan lihat dokumen Rencana Strategis Pusdatin PU."
          />

          {/* Folder List */}
          <RenstraFolderList initialData={initialFolders} isAdmin={isAdmin} />
        </div>
      </main>
    </div>
  )
}
