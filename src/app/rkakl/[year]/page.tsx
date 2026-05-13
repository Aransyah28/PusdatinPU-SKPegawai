import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { Navbar } from "@/components/layout/Navbar";
import { RkaklDocumentsTable } from "@/components/rkakl/RkaklDocumentsTable";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata = {
  title: "Dokumen RKAKL - Pusdatin PU",
  description: "Daftar dokumen Rencana Kerja dan Anggaran (RKAKL) berdasarkan tahun",
};

interface PageProps {
  params: Promise<{
    year: string;
  }>;
}

export default async function RkaklYearPage({ params }: PageProps) {
  const resolvedParams = await params;
  const year = resolvedParams.year;

  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList }).catch(() => null);

  const isAdmin = session?.user?.role === "admin";

  return (
    <div className="min-h-screen bg-background pt-20">
      <Navbar user={session?.user ?? null} />

      <main className="section-padding mx-auto max-w-[1600px]">
        {/* Breadcrumb Navigation */}
        <nav className="mb-6 flex items-center gap-2 text-body-sm font-medium text-body/40">
          <a
            href="https://htupusdatin.vercel.app/"
            className="transition-colors hover:text-primary"
          >
            Beranda
          </a>
          <span className="text-slate-300">&gt;</span>
          <Link href="/rkakl" className="transition-colors hover:text-primary">
            RKAKL
          </Link>
          <span className="text-slate-300">&gt;</span>
          <span className="font-black tracking-tight text-primary">Tahun {year}</span>
        </nav>

        <div className="space-y-8">
          {/* Header */}
          <div>
            <div className="mb-4">
              <Link
                href="/rkakl"
                className="inline-flex items-center gap-2 text-body-sm font-semibold text-body hover:text-primary transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                Kembali ke Daftar Tahun
              </Link>
            </div>
            
            <h1 className="text-headline-lg mb-1">RKAKL Tahun {year}</h1>
            <p className="text-title-md mt-2 max-w-2xl text-body/80">
              Kelola dan lihat dokumen Rencana Kerja dan Anggaran untuk tahun {year}.
            </p>
          </div>

          {/* Table Container */}
          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <RkaklDocumentsTable
              year={year}
              isAdmin={isAdmin}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
