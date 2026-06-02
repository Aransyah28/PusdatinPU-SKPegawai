/**
 * Helper functions untuk komponen Navbar.
 * Dipindahkan dari Navbar.tsx agar komponen tetap ramping.
 */

export function getInitial(name: string): string {
  return name.trim().charAt(0).toUpperCase();
}

export function getTitleFromPathname(pathname: string): string {
  // Handle dynamic routes like /laporanbulanan/2026 or /rkakl/2025
  const yearMatch = pathname.match(/^\/(laporan\w+|rkakl|laporan-keuangan|lpj-bendahara|renstra|lakip)\/([A-Za-z0-9-]+)$/);
  if (yearMatch) {
    const [, reportType, yearOrId] = yearMatch;
    const typeMap: Record<string, string> = {
      laporanbulanan: "Laporan Bulanan",
      laporankinerja: "Laporan Kinerja",
      laporanmingguan: "Laporan Mingguan",
      laporantriwulan: "Laporan Triwulan",
      rkakl: "Dokumen RKAKL",
      "laporan-keuangan": "Laporan Keuangan",
      "lpj-bendahara": "LPJ Bendahara",
      renstra: "Renstra",
      lakip: "LAKIP",
    };
    const title = typeMap[reportType] || "Laporan";
    // Jika Renstra/LAKIP, tampilkan "Folder ..." saja karena kita tidak tahu nama foldernya di sini tanpa fetching
    // Tapi bisa juga menampilkan ID/Year.
    if (reportType === "renstra") return "Folder Renstra";
    if (reportType === "lakip") return "Folder LAKIP";
    return `${title} ${yearOrId}`;
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
    "/renstra": "Dokumen Renstra",
    "/lakip": "Dokumen LAKIP",
  };

  return pathMap[pathname] || "Surat Keterangan Kepegawaian";
}

export function getBackUrlFromPathname(pathname: string): string {
  const BASE_URL = "https://htupusdatin.vercel.app";
  const URL_SURAT_KEPUTUSAN = BASE_URL + "/surat-keputusan";
  const URL_PELAPORAN = BASE_URL + "/pelaporan";
  const URL_KEUANGAN = BASE_URL + "/keuangan";

  const urlMap: Record<string, string> = {
    "/": URL_SURAT_KEPUTUSAN,
    "/admin/users": URL_SURAT_KEPUTUSAN,
    "/laporanbulanan": URL_PELAPORAN,
    "/laporankinerja": URL_PELAPORAN,
    "/laporanmingguan": URL_PELAPORAN,
    "/laporantriwulan": URL_PELAPORAN,
    "/sop": URL_PELAPORAN,
    "/rkakl": URL_KEUANGAN,
    "/laporan-keuangan": URL_KEUANGAN,
    "/lpj-bendahara": URL_KEUANGAN,
    "/renstra": URL_KEUANGAN, // Asumsi renstra masuk ke keuangan atau perencanaan
    "/lakip": URL_KEUANGAN, // Asumsi lakip masuk ke keuangan
  };

  return urlMap[pathname] || BASE_URL;
}
