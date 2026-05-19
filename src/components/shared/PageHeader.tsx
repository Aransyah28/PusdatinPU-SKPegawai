import * as React from "react";

interface PageHeaderProps {
  title: string;
  description: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div>
      <h1 className="text-headline-lg mb-1">{title}</h1>
      <p className="text-title-md mt-2 max-w-2xl text-body/80">{description}</p>
    </div>
  );
}
