import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { Navbar } from "@/components/layout/Navbar";
import { DocumentsSection } from "@/components/documents/DocumentsSection";

export default async function HomePage() {
  let session = null;
  try {
    session = await auth.api.getSession({ headers: await headers() });
  } catch (error) {
    console.error("Failed to fetch session:", error);
  }
  const isAdmin = session?.user?.role === "admin";

  return (
    <div className="min-h-screen bg-background pt-20">
      <Navbar user={session?.user ?? null} />

      <main className="section-padding mx-auto max-w-7xl">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-body-sm font-medium text-body/40">
          <a
            href="https://htupusdatin.vercel.app/"
            className="transition-colors hover:text-primary"
          >
            Home
          </a>
          <span>/</span>
          <a
            href="https://htupusdatin.vercel.app/kepegawaian"
            className="transition-colors hover:text-primary"
          >
            Kepegawaian
          </a>
          <span>/</span>
          <span className="font-bold text-primary">SK Kepegawaian</span>
        </nav>

        {/* Header halaman */}
        <div className="mb-10 lg:mb-12">
          <h1 className="text-headline-lg">
            Surat Keterangan Kepegawaian
          </h1>
          <p className="text-body-md mt-2 max-w-2xl">
            {isAdmin
              ? "Dashboard pengelola Surat Keterangan Kepegawaian Pusdatin PU."
              : "Akses dan unduh seluruh Surat Keterangan Kepegawaian resmi Pusdatin PU melalui portal satu pintu."}
          </p>
        </div>

        {/* Komponen tabel */}
        <DocumentsSection isAdmin={isAdmin} />
      </main>
    </div>
  );
}
