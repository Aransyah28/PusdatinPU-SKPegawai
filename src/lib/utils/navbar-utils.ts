/**
 * Helper functions untuk komponen Navbar.
 * Dipindahkan dari Navbar.tsx agar komponen tetap ramping.
 */

export function getInitial(name: string): string {
  return name.trim().charAt(0).toUpperCase();
}

export function getTitleFromPathname(pathname: string): string {
  // Handle dynamic routes like /laporanbulanan/2026 or /rkakl/2025
  const yearMatch = pathname.match(/^\/(laporan\w+|rkakl|laporan-keuangan|lpj-bendahara)\/(\d+)$/);
  if (yearMatch) {
    const [, reportType, year] = yearMatch;
    const typeMap: Record<string, string> = {
      laporanbulanan: "Laporan Bulanan",
      laporankinerja: "Laporan Kinerja",
      laporanmingguan: "Laporan Mingguan",
      laporantriwulan: "Laporan Triwulan",
      rkakl: "Dokumen RKAKL",
      "laporan-keuangan": "Laporan Keuangan",
      "lpj-bendahara": "LPJ Bendahara",
    };
    const title = typeMap[reportType] || "Laporan";
    return `${title} ${year}`;
  }

  // Handle dynamic SOP route like /sop/mti/2026
  const sopMatch = pathname.match(/^\/sop\/([^/]+)\/(\d+)$/);
  if (sopMatch) {
    const [, bidang, year] = sopMatch;
    return `SOP ${bidang.toUpperCase()} ${year}`;
  }

  const pathMap: Record<string, string> = {
    "/": "Surat Keterangan Kepegawaian",
    "/admin/users": "Kelola Pengguna",
    "/laporanbulanan": "Laporan Bulanan",
    "/laporankinerja": "Laporan Kinerja",
    "/laporanmingguan": "Laporan Mingguan",
    "/laporantriwulan": "Laporan Triwulan",
    "/sop": "Standar Operasional Prosedur",
    "/rkakl": "Dokumen RKAKL",
    "/laporan-keuangan": "Laporan Keuangan",
    "/lpj-bendahara": "LPJ Bendahara",
  };

  return pathMap[pathname] || "Surat Keterangan Kepegawaian";
}
