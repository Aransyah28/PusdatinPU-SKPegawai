import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageBreadcrumbs } from "@/components/shared/PageBreadcrumbs";
import { PageHeader } from "@/components/shared/PageHeader";
import { getLakipFolderBySlug } from "@/lib/lakip/lakip-queries";
import { LakipDocumentsTable } from "@/components/lakip/LakipDocumentsTable";
import { LakipUploadAction } from "@/components/lakip/LakipUploadAction";

export const dynamic = "force-dynamic";

export default async function LakipFolderPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const headersList = await headers();

  const sessionPromise = auth.api.getSession({ headers: headersList }).catch((error) => {
    console.error("Failed to fetch session:", error);
    return null;
  });

  const folderPromise = getLakipFolderBySlug(slug);

  const [session, folder] = await Promise.all([sessionPromise, folderPromise]);

  if (!folder) {
    notFound();
  }

  const isAdmin = session?.user?.role === "admin";

  return (
    <AppLayout user={session?.user ?? null}>
        {/* Breadcrumb Navigation */}
        <PageBreadcrumbs current={`LAKIP ${folder.name}`} />

        <div className="space-y-8 mt-4">
          {/* Header */}
          <PageHeader
            title={`LAKIP ${folder.name}`}
            description={`Kelola dan lihat dokumen yang berada di dalam folder ${folder.name}.`}
            action={isAdmin ? <LakipUploadAction folderSlug={folder.slug} /> : undefined}
          />

          {/* Table */}
          <LakipDocumentsTable folderSlug={folder.slug} folderName={folder.name} isAdmin={isAdmin} />
        </div>
      </AppLayout>
  );
}
