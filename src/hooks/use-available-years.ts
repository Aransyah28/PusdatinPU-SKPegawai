import { useQuery } from "@tanstack/react-query";

export interface AvailableYear {
  year: number;
  count: number;
}

export function useAvailableYears(reportType: string) {
  return useQuery<AvailableYear[]>({
    queryKey: ["available-years", reportType],
    queryFn: async () => {
      const res = await fetch(`/api/reports/${reportType}/years`);
      if (!res.ok) throw new Error("Gagal memuat tahun yang tersedia.");
      return res.json();
    },
  });
}
