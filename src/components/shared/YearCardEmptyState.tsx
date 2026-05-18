import * as React from "react";

interface YearCardEmptyStateProps {
  message: string;
}

export function YearCardEmptyState({ message }: YearCardEmptyStateProps) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-muted/30 py-12 text-center">
      <p className="text-body-md text-body/60">{message}</p>
    </div>
  );
}
