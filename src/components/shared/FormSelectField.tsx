import React from "react";
import { cn } from "@/lib/utils/cn";

interface FormSelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string | number; label: string }[];
  placeholder?: string;
}

export const FormSelectField = React.forwardRef<HTMLSelectElement, FormSelectFieldProps>(
  ({ label, error, options, placeholder, className, id, required, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    const selectClasses = cn(
      "w-full rounded-xl border border-border bg-background px-4 py-3 text-body-md transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 disabled:bg-muted",
      error && "border-destructive focus:ring-destructive/20 focus:border-destructive",
      className
    );

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="text-body-sm font-semibold text-heading/80 ml-1"
          >
            {label} {required && <span className="text-destructive">*</span>}
          </label>
        )}
        
        <select
          id={selectId}
          className={selectClasses}
          ref={ref}
          required={required}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {error && (
          <span className="text-label-md font-medium text-destructive ml-1">
            {error}
          </span>
        )}
      </div>
    );
  }
);

FormSelectField.displayName = "FormSelectField";
