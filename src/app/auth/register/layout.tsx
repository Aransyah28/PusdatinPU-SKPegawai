import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daftar - Pusdatin PU",
  description: "Buat akun baru di Portal SK Kepegawaian Pusdatin PU.",
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
