import { Download, Eye, FileText } from "lucide-react";
import { formatDate, formatFileSize } from "@/lib/utils/formatters";
import type { ReportDocumentRow } from "@/lib/reports/report-queries";

interface YearReportDocumentsTableProps {
  documents: ReportDocumentRow[];
}

export function YearReportDocumentsTable({ documents }: YearReportDocumentsTableProps) {
  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border py-14 text-center">
        <div className="mb-3 rounded-full bg-muted p-3">
          <FileText className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="text-title-md font-semibold text-heading">Belum ada dokumen</p>
        <p className="mt-1 max-w-xs text-sm text-body/70">
          Dokumen PDF untuk tahun ini belum tersedia.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-white shadow-sm">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-primary">
            <th className="px-4 py-2.5 text-sm font-semibold text-white">No</th>
            <th className="px-4 py-2.5 text-sm font-semibold text-white">Judul Laporan</th>
            <th className="px-4 py-2.5 text-center text-sm font-semibold text-white">Tahun</th>
            <th className="whitespace-nowrap px-4 py-2.5 text-center text-sm font-semibold text-white">Diunggah Oleh</th>
            <th className="w-48 px-4 py-2.5 text-center text-sm font-semibold text-white">Tanggal Unggah</th>
            <th className="px-4 py-2.5 text-sm font-semibold text-white">Ukuran File</th>
            <th className="px-4 py-2.5 text-center text-sm font-semibold text-white">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50">
          {documents.map((doc, idx) => (
            <tr key={doc.id} className="transition-colors hover:bg-muted/10">
              <td className="px-4 py-3.5 text-sm font-medium text-body/40">{idx + 1}</td>
              <td className="px-4 py-3.5">
                <div className="text-body-lg font-bold text-heading">{doc.title}</div>
                {doc.description && (
                  <div className="mt-0.5 text-body-sm text-body/60">{doc.description}</div>
                )}
              </td>
              <td className="px-4 py-3.5 text-center">
                <span className="inline-flex items-center rounded-full bg-accent-blue/50 px-2.5 py-0.5 text-xs font-semibold text-accent-blue-foreground">
                  {doc.year}
                </span>
              </td>
              <td className="px-4 py-3.5 text-center">
                <div className="text-sm font-medium text-body">
                  {doc.uploaderName ?? <span className="text-body/30">—</span>}
                </div>
              </td>
              <td className="px-4 py-3.5 text-center">
                <div className="text-sm text-body/70">{formatDate(doc.createdAt)}</div>
              </td>
              <td className="px-4 py-3.5">
                <div className="text-sm text-body/70">{formatFileSize(doc.fileSize)}</div>
              </td>
              <td className="px-4 py-3.5">
                <div className="flex items-center justify-center gap-2">
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-body transition-all hover:bg-muted/80"
                    title="Lihat"
                  >
                    <Eye className="h-4 w-4" />
                  </a>
                  <a
                    href={doc.fileUrl}
                    download={doc.fileName}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-blue/20 text-accent-blue-foreground transition-all hover:bg-accent-blue/40"
                    title="Unduh"
                  >
                    <Download className="h-4 w-4" />
                  </a>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
