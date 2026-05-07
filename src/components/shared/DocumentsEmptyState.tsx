import { FileText } from "lucide-react";

interface DocumentsEmptyStateProps {
  searchQuery?: string;
  emptyMessage?: string;
}

export function DocumentsEmptyState({
  searchQuery,
  emptyMessage = "Belum ada dokumen yang tersedia.",
}: DocumentsEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border py-14 text-center">
      <div className="mb-3 rounded-full bg-muted p-3">
        <FileText className="h-8 w-8 text-muted-foreground" />
      </div>
      <p className="text-title-md font-semibold text-heading">Belum ada dokumen</p>
      <p className="mt-1 max-w-xs text-sm text-body/70">
        {searchQuery
          ? `Tidak ditemukan dokumen untuk kata kunci "${searchQuery}"`
          : emptyMessage}
      </p>
    </div>
  );
}
