import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/providers";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pusdatin PU — SK Kepegawaian",
  description:
    "Portal Surat Keterangan Kepegawaian Pusat Data dan Informasi Pekerjaan Umum",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={`${inter.className} min-h-screen bg-background`}>
        <Providers>
          {children}
          <Toaster richColors position="top-right" duration={1500} />
        </Providers>
      </body>
    </html>
  );
}
