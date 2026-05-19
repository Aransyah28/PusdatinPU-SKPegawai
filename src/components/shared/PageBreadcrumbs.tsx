import * as React from "react";

interface PageBreadcrumbsProps {
  current: string;
}

export function PageBreadcrumbs({ current }: PageBreadcrumbsProps) {
  return (
    <nav className="mb-6 flex items-center gap-2 text-body-sm font-medium text-body/40">
      <a
        href="/"
        className="transition-colors hover:text-primary"
      >
        Beranda
      </a>
      <span className="text-slate-300">&gt;</span>
      <span className="font-black tracking-tight text-primary">{current}</span>
    </nav>
  );
}
