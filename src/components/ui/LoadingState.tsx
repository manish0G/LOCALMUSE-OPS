import React from "react";
import { cn } from "@/lib/utils";

export interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({
  message = "Retrieving cultural intelligence...",
  className
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-[#202E1D]/12 bg-[#FCFBF7] text-[#202E1D]",
        className
      )}
    >
      <div className="relative w-8 h-8 mb-4">
        <div className="absolute inset-0 rounded-full border-2 border-[#8F9A82]/20" />
        <div className="absolute inset-0 rounded-full border-2 border-[#202E1D] border-t-transparent animate-spin" />
      </div>
      <p className="font-serif text-base font-medium text-[#202E1D]">{message}</p>
      <p className="text-[11px] text-[#8F9A82] font-mono mt-1">Executing Qloo workflow tools</p>
    </div>
  );
}

export function SkeletonLine({ className }: { className?: string }) {
  return <div className={cn("h-4 rounded-md bg-[#8F9A82]/20 animate-pulse", className)} />;
}
