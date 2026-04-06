import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { Navbar } from "@/components/layout/Navbar";

export const dynamic = "force-dynamic";

export default async function LaporanKinerjaPage() {
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

      <main className="section-padding mx-auto max-w-[1600px]">
        <div className="mb-10 lg:mb-12">
          <h1 className="text-headline-lg">Surat Keterangan Kepegawaian</h1>
          <p className="text-body-md mt-2 max-w-2xl">
            {isAdmin
              ? "Dashboard pengelola Surat Keterangan Kepegawaian Pusdatin PU."
              : "Akses dan unduh seluruh Surat Keterangan Kepegawaian resmi Pusdatin PU melalui portal satu pintu."}
          </p>
        </div>
      </main>
    </div>
  );
}
