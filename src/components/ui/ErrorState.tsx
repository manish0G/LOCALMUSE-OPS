import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";

export interface ErrorStateProps {
  title?: string;
  message: string;
  code?: string;
  recovery?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Operation Failed",
  message,
  code,
  recovery,
  onRetry,
  className
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-rose-200 bg-rose-50/70 p-5 sm:p-6 text-left space-y-3 text-[#202E1D]",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-700 shrink-0 mt-0.5">
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="font-serif text-base font-semibold text-rose-950">{title}</h4>
            {code && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-rose-100 text-rose-800 border border-rose-200 font-semibold">
                {code}
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-rose-900 leading-relaxed font-sans">{message}</p>
          {recovery && (
            <p className="text-xs text-rose-800/80 mt-1.5 font-medium font-sans">
              Recovery hint: {recovery}
            </p>
          )}
        </div>
      </div>
      {onRetry && (
        <div className="pt-2 flex justify-end">
          <Button variant="primary" size="sm" onClick={onRetry}>
            Retry Operation &rarr;
          </Button>
        </div>
      )}
    </div>
  );
}
