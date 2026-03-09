import React from "react";
import { cn } from "@/lib/utils/cn";

interface FormTextFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label?: string;
  error?: string;
  multiline?: boolean;
}

export const FormTextField = React.forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  FormTextFieldProps
>(({ label, error, multiline, className, id, ...props }, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  const inputClasses = cn(
    "w-full rounded-xl border border-border bg-background px-4 py-3 text-body-md transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 disabled:bg-muted",
    error && "border-destructive focus:ring-destructive/20 focus:border-destructive",
    className
  );

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="text-body-sm font-semibold text-heading/80 ml-1"
        >
          {label} {props.required && <span className="text-destructive">*</span>}
        </label>
      )}
      
      {multiline ? (
        <textarea
          id={inputId}
          className={cn(inputClasses, "resize-none min-h-[100px]")}
          ref={ref as React.Ref<HTMLTextAreaElement>}
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          id={inputId}
          className={inputClasses}
          ref={ref as React.Ref<HTMLInputElement>}
          {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
        />
      )}

      {error && (
        <span className="text-label-md font-medium text-destructive ml-1">
          {error}
        </span>
      )}
    </div>
  );
});

FormTextField.displayName = "FormTextField";
