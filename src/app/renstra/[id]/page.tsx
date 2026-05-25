import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { PageBreadcrumbs } from "@/components/shared/PageBreadcrumbs";
import { PageHeader } from "@/components/shared/PageHeader";
import { getRenstraFolderById } from "@/lib/renstra/renstra-queries";
import { RenstraDocumentsTable } from "@/components/renstra/RenstraDocumentsTable";

export const metadata = {
  title: "Detail Folder Renstra - Pusdatin PU",
  description: "Daftar dokumen di dalam folder Renstra",
};

export const dynamic = "force-dynamic";

export default async function RenstraFolderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const headersList = await headers();
  
  const sessionPromise = auth.api.getSession({ headers: headersList }).catch((error) => {
    console.error("Failed to fetch session:", error);
    return null;
  });
  
  const folderPromise = getRenstraFolderById(id);

  const [session, folder] = await Promise.all([sessionPromise, folderPromise]);

  if (!folder) {
    notFound();
  }

  const isAdmin = session?.user?.role === "admin";

  return (
    <div className="min-h-screen bg-background pt-20">
      <Navbar user={session?.user ?? null} />

      <main className="section-padding mx-auto max-w-[1600px]">
        {/* Breadcrumb Navigation */}
        <PageBreadcrumbs current={`Folder: ${folder.name}`} />

        <div className="space-y-8 mt-4">
          {/* Header */}
          <PageHeader 
            title={`Dokumen: ${folder.name}`}
            description={`Kelola dan lihat dokumen yang berada di dalam folder ${folder.name}.`}
          />

          {/* Table */}
          <RenstraDocumentsTable folderId={id} folderName={folder.name} isAdmin={isAdmin} />
        </div>
      </main>
    </div>
  );
}
