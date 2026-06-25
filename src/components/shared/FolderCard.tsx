import Link from "next/link";
import * as React from "react";
import { FolderIcon, Trash2 } from "lucide-react";

interface FolderCardProps {
  href: string;
  name: string;
  count: number;
  onDeleteClick?: (e: React.MouseEvent) => void;
}

export function FolderCard({ href, name, count, onDeleteClick }: FolderCardProps) {
  return (
    <div
      className="group relative overflow-hidden rounded-4xl border border-border bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:border-primary hover:shadow-2xl hover:shadow-primary/20 active:scale-95 flex flex-col h-[200px]"
    >
      <Link
        href={href}
        className="absolute inset-0 z-10 rounded-4xl focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
        aria-label={`Buka folder ${name}`}
      />

      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />
      
      {onDeleteClick && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDeleteClick(e);
          }}
          className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-destructive/10 text-destructive transition-all duration-200 hover:bg-destructive hover:text-white focus-visible:ring-2 focus-visible:ring-destructive focus-visible:outline-none"
          title="Hapus Folder"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}

      <div className="relative z-0 flex flex-col items-center justify-center p-6 text-center h-full pointer-events-none">
        <FolderIcon className="w-12 h-12 text-primary/80 mb-4 group-hover:text-primary transition-colors" />
        <span className="text-title-md font-bold text-primary line-clamp-2">{name}</span>
        <p className="mt-3 inline-flex items-center justify-center rounded-full bg-primary/5 px-4 py-1.5 text-sm font-semibold tracking-wide text-primary/80">
          {count} Dokumen
        </p>
      </div>
    </div>
  );
}
