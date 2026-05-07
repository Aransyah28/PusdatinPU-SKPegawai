import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { Navbar } from "@/components/layout/Navbar";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SopDocumentsTable } from "@/components/sops/SopDocumentsTable";
import { getSopDocuments } from "@/lib/sops/sop-queries";
import { isSopBidang } from "@/lib/sops/sop-types";

export const dynamic = "force-dynamic";

interface SopYearPageProps {
  params: Promise<{ bidang: string; year: string }>;
}

export default async function SopYearPage({
  params,
}: SopYearPageProps) {
  const { bidang, year } = await params;
  const upperBidang = bidang.toUpperCase();
  const yearNumber = Number.parseInt(year, 10);

  if (Number.isNaN(yearNumber) || !isSopBidang(upperBidang)) {
    notFound();
  }

  let fetchError = false;
  const [session, sopDocuments] = await Promise.all([
    headers().then((h) => auth.api.getSession({ headers: h })).catch((error) => {
      console.error("Failed to fetch session:", error);
      return null;
    }),
    getSopDocuments(upperBidang, yearNumber).catch((error) => {
      console.error("Failed to fetch SOP:", error);
      fetchError = true;
      return [];
    }),
  ]);

  const bidangName = upperBidang;

  return (
    <div className="min-h-screen bg-background pt-20">
      <Navbar user={session?.user ?? null} />

      <main className="section-padding mx-auto max-w-[1600px]">
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

        {fetchError ? (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center">
            <p className="text-label-lg text-destructive">
              Gagal memuat data SOP. Silakan muat ulang halaman.
            </p>
          </div>
        ) : (
          <SopDocumentsTable 
            documents={sopDocuments}
            isAdmin={session?.user?.role === "admin"}
            bidang={upperBidang}
            year={yearNumber}
          />
        )}
      </main>
    </div>
  );
}
