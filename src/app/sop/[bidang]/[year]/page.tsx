import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { AppLayout } from "@/components/layout/AppLayout";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SopDocumentsTable } from "@/components/sops/SopDocumentsTable";
import { isSopBidang } from "@/lib/sops/sop-types";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps) {
  const { bidang, year } = await params;
  return {
    title: `SOP ${bidang.toUpperCase()} ${year} - Pusdatin PU`,
    description: `Daftar Standar Operasional Prosedur (SOP) Bidang ${bidang.toUpperCase()} untuk tahun ${year}.`,
  };
}

interface PageProps {
  params: Promise<{ bidang: string; year: string }>;
}

export default async function SopYearPage({
  params,
}: PageProps) {
  const { bidang, year } = await params;
  const upperBidang = bidang.toUpperCase();
  const yearNumber = Number.parseInt(year, 10);

  if (Number.isNaN(yearNumber) || !isSopBidang(upperBidang)) {
    notFound();
  }

  const session = await headers()
    .then((h) => auth.api.getSession({ headers: h }))
    .catch(() => null);

  const isAdmin = session?.user?.role === "admin";
  const bidangName = upperBidang;

  return (
    <AppLayout user={session?.user ?? null}>
        <div className="mb-6 flex items-center gap-3">
          <nav className="flex flex-wrap items-center gap-2 text-body-sm font-medium text-body/40">
            <a
              href="https://htupusdatin.vercel.app/"
              className="transition-colors hover:text-primary"
            >
              Beranda
            </a>
            <span className="text-slate-300">&gt;</span>
            <Link
              href="/sop"
              className="transition-colors hover:text-primary"
            >
              SOP
            </Link>
            <span className="text-slate-300">&gt;</span>
            <span className="font-black tracking-tight text-primary">{bidangName} - {year}</span>
          </nav>
        </div>

        <div className="mb-10 lg:mb-12">
          <h1 className="text-headline-lg mb-1">SOP {bidangName} {year}</h1>
          <p className="text-title-md mt-2 max-w-2xl text-body/80">
            Berikut adalah daftar Standar Operasional Prosedur (SOP) Bidang {bidangName} Pusdatin PU untuk tahun {year}.
          </p>
        </div>

        <SopDocumentsTable 
          isAdmin={isAdmin}
          bidang={upperBidang}
          year={yearNumber}
        />
      </AppLayout>
  );
}
