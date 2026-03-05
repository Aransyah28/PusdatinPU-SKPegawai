import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { Navbar } from "@/components/layout/Navbar";
import { DocumentsSection } from "@/components/documents/DocumentsSection";

export default async function HomePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const isAdmin = session?.user?.role === "admin";

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <Navbar user={session?.user ?? null} />

      <main className="mx-auto max-w-7xl px-6 py-10">
        {/* Breadcrumb */}
        <nav className="mb-4 flex items-center gap-1.5 text-sm text-gray-400">
          <a
            href="https://htupusdatin.vercel.app/"
            className="transition-colors hover:text-gray-600"
          >
            Home
          </a>
          <span>›</span>
          <a
            href="https://htupusdatin.vercel.app/kepegawaian"
            className="transition-colors hover:text-gray-600"
          >
            Kepegawaian dan Jabatan Fungsional
          </a>
          <span>›</span>
          <span className="font-semibold text-[#142B6F]">SK Kepegawaian</span>
        </nav>

        {/* Header halaman */}
        <div className="mb-8">
          <h1 className="mb-1 text-[34px] font-extrabold leading-tight tracking-tight text-[#142B6F]">
            Surat Keterangan Kepegawaian
          </h1>
          <p className="text-[15px] font-medium text-gray-500">
            {isAdmin
              ? "Kelola daftar Surat Keterangan Kepegawaian Pusdatin PU."
              : "Unduh Surat Keterangan Kepegawaian yang tersedia."}
          </p>
        </div>

        {/* Komponen tabel — menangani data fetching & tampilan admin/publik */}
        <DocumentsSection isAdmin={isAdmin} />
      </main>
    </div>
  );
}
