"use client";

import { Eye, Download, Trash2, Loader2 } from "lucide-react";
import { formatFileSize, formatDate } from "@/lib/utils/formatters";
import type { Document } from "./DocumentsSection";

interface DocumentsMobileListProps {
  documents: Document[];
  isAdmin: boolean;
  downloadingId: string | null;
  deletingId: string | null;
  onDownload: (doc: Document) => void;
  onDelete: (id: string) => void;
}

export function DocumentsMobileList({
  documents,
  isAdmin,
  downloadingId,
  deletingId,
  onDownload,
  onDelete,
}: DocumentsMobileListProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:hidden">
      {documents.map((doc) => (
        <div key={doc.id} className="relative flex flex-col gap-3 rounded-2xl border border-border bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-body-lg font-bold text-heading leading-tight">{doc.title}</h3>
              {doc.description && <p className="mt-1 text-sm text-body/60">{doc.description}</p>}
            </div>
            <span className="inline-flex shrink-0 items-center rounded-full bg-accent-blue/50 px-2.5 py-0.5 text-xs font-semibold text-accent-blue-foreground">
              {doc.year}
            </span>
          </div>
          
          <div className="flex flex-col gap-1.5 text-sm text-body/70 mt-1">
            <div className="flex items-center justify-between">
              <span>Diunggah oleh:</span>
              <span className="font-medium text-body text-right">{doc.uploaderName ?? "—"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Tanggal:</span>
              <span className="text-right">{formatDate(new Date(doc.createdAt))}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Ukuran:</span>
              <span className="text-right">{formatFileSize(doc.fileSize)}</span>
            </div>
          </div>

          <div className="pt-3 mt-1 flex items-center justify-end gap-2 border-t border-border/50">
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
        </div>
      ))}
    </div>
  );
}
