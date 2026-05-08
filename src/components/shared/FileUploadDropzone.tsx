import React, { useRef } from "react";
import { UploadCloud, X, FileText } from "lucide-react";
import { MAX_UPLOAD_FILE_SIZE_MB } from "@/lib/constants";
import { cn } from "@/lib/utils/cn";

interface FileUploadDropzoneProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
  helperText?: string;
  accept?: string;
  maxSizeMB?: number;
  className?: string;
}

export function FileUploadDropzone({
  file,
  onFileChange,
  helperText = `Maks. ${MAX_UPLOAD_FILE_SIZE_MB} MB`,
  accept = "application/pdf",
  maxSizeMB = MAX_UPLOAD_FILE_SIZE_MB,
  className,
}: FileUploadDropzoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={cn("space-y-2", className)}>
      <label className="ml-1 text-body-sm font-semibold text-heading/80">
        File PDF <span className="text-destructive">*</span>
      </label>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(event) => {
          const selectedFile = event.target.files?.[0];
          if (selectedFile) {
            onFileChange(selectedFile);
          } else {
            onFileChange(null);
          }
        }}
      />
      {file ? (
        <div className="flex items-center gap-4 rounded-xl border border-primary/20 bg-primary/5 p-4 transition-all">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <FileText className="h-6 w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-body-md font-bold text-heading">{file.name}</p>
            <p className="text-label-md text-body/60">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          <button
            onClick={() => {
              onFileChange(null);
              if (fileInputRef.current) fileInputRef.current.value = "";
            }}
            type="button"
            className="touch-target rounded-full text-body/40 transition-all hover:bg-muted hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="group flex w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border py-6 transition-all hover:border-primary/50 hover:bg-primary/5"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground transition-all group-hover:bg-primary/10 group-hover:text-primary">
            <UploadCloud className="h-7 w-7" />
          </div>
          <div className="text-center">
            <p className="text-body-md font-bold text-heading">Klik untuk memilih file PDF</p>
            <p className="mt-1 text-label-md text-body/60">
              {helperText}
            </p>
          </div>
        </button>
      )}
    </div>
  );
}
