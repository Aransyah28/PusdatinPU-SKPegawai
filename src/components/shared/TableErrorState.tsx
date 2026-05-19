import * as React from "react";

interface TableErrorStateProps {
  message?: string;
}

export function TableErrorState({ message = "Gagal memuat data. Silakan muat ulang halaman." }: TableErrorStateProps) {
  return (
    <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center">
      <p className="text-label-lg text-destructive">{message}</p>
    </div>
  );
}
