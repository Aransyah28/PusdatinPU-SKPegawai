import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { AppLayout } from "@/components/layout/AppLayout";
import { DocumentsSection } from "@/components/documents/DocumentsSection";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps) {
  const { year } = await params;
  return {
    title: `SK Kepegawaian ${year} - Pusdatin PU`,
    description: `Daftar Surat Keterangan Kepegawaian Pusdatin PU untuk tahun ${year}.`,
  };
}

interface PageProps {
  params: Promise<{ year: string }>;
}

export default async function SKPegawaiYearPage({ params }: PageProps) {
  const { year } = await params;
  const yearNumber = Number.parseInt(year, 10);

  if (Number.isNaN(yearNumber)) {
    notFound();
  }

  const session = await headers()
    .then((h) => auth.api.getSession({ headers: h }))
    .catch(() => null);

  const isAdmin = session?.user?.role === "admin";

  return (
    <AppLayout user={session?.user ?? null}>
        {/* Breadcrumb Navigation */}
        <div className="mb-6 flex items-center gap-3">
          <nav className="flex items-center gap-2 text-body-sm font-medium text-body/40">
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
            <Link href="/" className="transition-colors hover:text-primary">
              SK Kepegawaian
            </Link>
            <span className="text-slate-300">&gt;</span>
            <span className="font-black tracking-tight text-primary">{year}</span>
          </nav>
        </div>

        <div className="mb-10 lg:mb-12">
          <PageHeader 
            title={`SK Kepegawaian Tahun ${year}`}
            description={isAdmin
              ? `Kelola dokumen Surat Keterangan Kepegawaian Pusdatin PU untuk tahun ${year}.`
              : `Akses dan unduh dokumen Surat Keterangan Kepegawaian resmi Pusdatin PU untuk tahun ${year}.`}
          />
        </div>

        <DocumentsSection isAdmin={isAdmin} year={year} />
      </AppLayout>
  );
}
