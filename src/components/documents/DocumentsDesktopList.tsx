"use client";

import { Eye, Download, Trash2, Loader2 } from "lucide-react";
import { formatFileSize, formatDate } from "@/lib/utils/formatters";
import type { Document } from "./DocumentsSection";

interface DocumentsDesktopListProps {
  documents: Document[];
  currentPage: number;
  itemsPerPage: number;
  isAdmin: boolean;
  downloadingId: string | null;
  deletingId: string | null;
  onDownload: (doc: Document) => void;
  onDelete: (id: string) => void;
}

export function DocumentsDesktopList({
  documents,
  currentPage,
  itemsPerPage,
  isAdmin,
  downloadingId,
  deletingId,
  onDownload,
  onDelete,
}: DocumentsDesktopListProps) {
  return (
    <div className="hidden md:block overflow-x-auto rounded-2xl border border-border bg-white shadow-sm">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-primary">
            <th className="px-4 py-2.5 text-sm font-semibold text-white">No</th>
            <th className="px-4 py-2.5 text-sm font-semibold text-white">Judul SK</th>
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
              <td className="px-4 py-3.5 text-sm font-medium text-body/40">
                {(currentPage - 1) * itemsPerPage + idx + 1}
              </td>
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
                <div className="text-sm text-body/70">
                  {formatDate(new Date(doc.createdAt))}
                </div>
              </td>
              <td className="px-4 py-3.5">
                <div className="text-sm text-body/70">
                  {formatFileSize(doc.fileSize)}
                </div>
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
                  <button
                    onClick={() => onDownload(doc)}
                    disabled={downloadingId === doc.id}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-blue/20 text-accent-blue-foreground transition-all hover:bg-accent-blue/40 disabled:opacity-50"
                    title="Unduh"
                  >
                    {downloadingId === doc.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4" />
                    )}
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => onDelete(doc.id)}
                      disabled={deletingId === doc.id}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-red/20 text-accent-red-foreground transition-all hover:bg-accent-red/40 disabled:opacity-50"
                      title="Hapus"
                    >
                      {deletingId === doc.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
