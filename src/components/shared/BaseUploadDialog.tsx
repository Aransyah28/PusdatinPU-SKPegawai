"use client";

import { useEffect } from "react";
import { Loader2, X } from "lucide-react";

interface BaseUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  children: React.ReactNode;
  onCancel: () => void;
  onSave: () => void;
  saveDisabled?: boolean;
  saveLabel?: string;
  isPending?: boolean;
}

export function BaseUploadDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  onCancel,
  onSave,
  saveDisabled = false,
  saveLabel = "Simpan",
  isPending = false,
}: BaseUploadDialogProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return;
    }

    document.body.style.overflow = "unset";
  }, [open]);

  if (!open) return null;

  const handleClose = () => {
    onCancel();
    onOpenChange(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-heading/40 p-4 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="max-h-[95vh] w-full max-w-lg animate-in fade-in zoom-in overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl duration-200"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-title-lg text-heading">{title}</h2>
            <p className="mt-1 text-body-sm text-body/60">
              {description}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="touch-target rounded-full text-body/40 transition-all hover:bg-muted hover:text-body"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          {children}
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={handleClose}
            className="rounded-full px-6 py-2.5 text-body-md font-bold text-body transition-all hover:bg-muted"
          >
            Batal
          </button>
          <button
            onClick={onSave}
            disabled={saveDisabled || isPending}
            className="flex items-center gap-2 rounded-full bg-primary px-8 py-2.5 text-body-md font-bold text-white shadow-lg transition-all hover:bg-primary/90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {saveLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
