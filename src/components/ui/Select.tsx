import React from "react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options?: SelectOption[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helperText, options = [], children, id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label htmlFor={selectId} className="block text-[11px] font-mono uppercase tracking-wider text-[#202E1D]/80">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            className={cn(
              "w-full rounded-xl bg-white border border-[#202E1D]/20 px-3.5 py-2 pr-8 text-xs sm:text-sm text-[#202E1D] transition-colors focus:border-[#202E1D] focus:outline-none focus:ring-1 focus:ring-[#8F9A82] disabled:cursor-not-allowed disabled:opacity-50 appearance-none cursor-pointer shadow-2xs font-sans",
              error && "border-rose-400 focus:border-rose-600 focus:ring-rose-200",
              className
            )}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled} className="bg-[#FAF8F2] text-[#202E1D]">
                {opt.label}
              </option>
            ))}
            {children}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-[#8F9A82]">
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        {error && <p className="text-xs text-rose-700 mt-1">{error}</p>}
        {helperText && !error && <p className="text-xs text-[#202E1D]/60 mt-1">{helperText}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";
