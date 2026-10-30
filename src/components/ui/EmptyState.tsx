import React from "react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-dashed border-[#202E1D]/20 bg-[#FCFBF7] max-w-lg mx-auto text-[#202E1D]",
        className
      )}
    >
      <div className="w-10 h-10 rounded-full bg-[#8F9A82]/15 border border-[#8F9A82]/30 flex items-center justify-center text-[#202E1D] mb-3.5">
        {icon || (
          <svg className="w-5 h-5 text-[#8F9A82]" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 2c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zm0 14.5A6.5 6.5 0 1110 3.5a6.5 6.5 0 010 13z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>
      <h4 className="font-serif text-lg font-normal text-[#202E1D]">{title}</h4>
      <p className="text-xs sm:text-sm text-[#202E1D]/70 mt-1 max-w-sm leading-relaxed font-sans">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
