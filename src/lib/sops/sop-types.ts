export const sopBidangList = ["MTI", "BDA", "PDBI", "TU"] as const;

export type SopBidang = typeof sopBidangList[number];

export function isSopBidang(bidang: string): bidang is SopBidang {
  return sopBidangList.includes(bidang as SopBidang);
}

export const sopBidangMap: Record<SopBidang, { title: string }> = {
  MTI: { title: "Manajemen Teknologi Informasi (MTI)" },
  BDA: { title: "Basis Data dan Aplikasi (BDA)" },
  PDBI: { title: "Pusat Data dan Bisnis Intelijen (PDBI)" },
  TU: { title: "Tata Usaha (TU)" },
};
