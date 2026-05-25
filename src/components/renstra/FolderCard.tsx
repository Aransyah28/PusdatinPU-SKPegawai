import Link from "next/link";
import * as React from "react";
import { FolderIcon } from "lucide-react";

interface FolderCardProps {
  href: string;
  name: string;
  count: number;
}

export function FolderCard({ href, name, count }: FolderCardProps) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-4xl border border-border bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:border-primary hover:shadow-2xl hover:shadow-primary/20 active:scale-95 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none flex flex-col h-[200px]"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative flex flex-col items-center justify-center p-6 text-center h-full">
        <FolderIcon className="w-12 h-12 text-primary/80 mb-4 group-hover:text-primary transition-colors" />
        <span className="text-title-md font-bold text-primary line-clamp-2">{name}</span>
        <p className="mt-3 inline-flex items-center justify-center rounded-full bg-primary/5 px-4 py-1.5 text-sm font-semibold tracking-wide text-primary/80">
          {count} Dokumen
        </p>
      </div>
    </Link>
  );
}
