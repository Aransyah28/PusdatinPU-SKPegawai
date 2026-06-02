import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { AppLayout } from "@/components/layout/AppLayout";
import { DocumentsSection } from "@/components/documents/DocumentsSection";
import { PageBreadcrumbs } from "@/components/shared/PageBreadcrumbs";
import { PageHeader } from "@/components/shared/PageHeader";

export const metadata = {
  title: "SK Kepegawaian - Pusdatin PU",
  description: "Portal Surat Keterangan Kepegawaian Pusdatin PU.",
};

export const dynamic = "force-dynamic";

export default async function BerandaPage() {
  let session = null;
  try {
    session = await auth.api.getSession({ headers: await headers() });
  } catch (error) {
    console.error("Failed to fetch session:", error);
  }
  const isAdmin = session?.user?.role === "admin";

  return (
    <AppLayout user={session?.user ?? null}>
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-body-sm font-medium text-body/40">
          <a
            href="https://htupusdatin.vercel.app/"
            className="transition-colors hover:text-primary"
          >
            Beranda
          </a>
          <span className="text-slate-300">&gt;</span>
          <a
            href="https://htupusdatin.vercel.app/kepegawaian"
            className="transition-colors hover:text-primary"
          >
            Kepegawaian
          </a>
          <span className="text-slate-300">&gt;</span>
          <span className="font-black tracking-tight text-primary">SK Kepegawaian</span>
        </nav>

        {/* Header halaman */}
        <div className="mb-10 lg:mb-12">
          <PageHeader 
            title="Surat Keterangan Kepegawaian"
            description={isAdmin
              ? "Dashboard pengelola Surat Keterangan Kepegawaian Pusdatin PU"
              : "Akses dan unduh seluruh Surat Keterangan Kepegawaian resmi Pusdatin PU melalui portal satu pintu."}
          />
        </div>

        {/* Komponen tabel */}
        <DocumentsSection isAdmin={isAdmin} />
      </AppLayout>
  );
}
