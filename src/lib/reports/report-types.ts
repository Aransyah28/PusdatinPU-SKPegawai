export const reportTypeMap = {
  bulanan: {
    blobDirectory: "laporanbulanan",
    title: "Laporan Bulanan",
  },
  kinerja: {
    blobDirectory: "laporankinerja",
    title: "Laporan Kinerja",
  },
  mingguan: {
    blobDirectory: "laporanmingguan",
    title: "Laporan Mingguan",
  },
  triwulan: {
    blobDirectory: "laporantriwulan",
    title: "Laporan Triwulan",
  },
} as const;

export type ReportType = keyof typeof reportTypeMap;

export function isReportType(reportType: string): reportType is ReportType {
  return reportType in reportTypeMap;
}

export function getReportTypeConfig(reportType: string) {
  return reportTypeMap[reportType as ReportType] ?? null;
}
