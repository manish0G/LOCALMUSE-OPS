import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, leftIcon, rightIcon, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label htmlFor={inputId} className="block text-[11px] font-mono uppercase tracking-wider text-[#202E1D]/80">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3 text-[#8F9A82] pointer-events-none flex items-center">
              {leftIcon}
            </span>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              "w-full rounded-xl bg-white border border-[#202E1D]/20 px-3.5 py-2 text-xs sm:text-sm text-[#202E1D] placeholder:text-[#202E1D]/40 transition-colors focus:border-[#202E1D] focus:outline-none focus:ring-1 focus:ring-[#8F9A82] disabled:cursor-not-allowed disabled:opacity-50 shadow-2xs font-sans",
              leftIcon ? "pl-9" : undefined,
              rightIcon ? "pr-9" : undefined,
              error ? "border-rose-400 focus:border-rose-600 focus:ring-rose-200" : undefined,
              className
            )}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3 text-[#8F9A82] pointer-events-none flex items-center">
              {rightIcon}
            </span>
          )}
        </div>
        {error && <p className="text-xs text-rose-700 mt-1">{error}</p>}
        {helperText && !error && <p className="text-xs text-[#202E1D]/60 mt-1">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
