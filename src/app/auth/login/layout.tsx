import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Masuk - Pusdatin PU",
  description: "Masuk ke Portal SK Kepegawaian Pusdatin PU.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
