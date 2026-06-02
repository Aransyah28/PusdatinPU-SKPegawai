import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageBreadcrumbs } from "@/components/shared/PageBreadcrumbs";
import { PageHeader } from "@/components/shared/PageHeader";
import { getRenstraFolderBySlug } from "@/lib/renstra/renstra-queries";
import { RenstraDocumentsTable } from "@/components/renstra/RenstraDocumentsTable";

export const dynamic = "force-dynamic";

export default async function RenstraFolderPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const headersList = await headers();

  const sessionPromise = auth.api.getSession({ headers: headersList }).catch((error) => {
    console.error("Failed to fetch session:", error);
    return null;
  });

  const folderPromise = getRenstraFolderBySlug(slug);

  const [session, folder] = await Promise.all([sessionPromise, folderPromise]);

  if (!folder) {
    notFound();
  }

  const isAdmin = session?.user?.role === "admin";

  return (
    <AppLayout user={session?.user ?? null}>
        {/* Breadcrumb Navigation */}
        <PageBreadcrumbs current={`Renstra ${folder.name}`} />

        <div className="space-y-8 mt-4">
          {/* Header */}
          <PageHeader
            title={`Renstra ${folder.name}`}
            description={`Kelola dan lihat dokumen yang berada di dalam folder ${folder.name}.`}
          />

          {/* Table */}
          <RenstraDocumentsTable folderSlug={folder.slug} folderName={folder.name} isAdmin={isAdmin} />
        </div>
      </AppLayout>
  );
}
