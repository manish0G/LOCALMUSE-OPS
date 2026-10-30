"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { TextRevealOnScroll } from "@/components/common/TextRevealOnScroll";

export interface SectionHeaderProps {
  badge?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function SectionHeader({
  badge,
  title,
  description,
  action,
  className
}: SectionHeaderProps) {
  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#202E1D]/10 text-left", className)}>
      <div className="space-y-1.5 text-left">
        {badge && <div className="mb-1">{badge}</div>}
        <TextRevealOnScroll
          as="h2"
          text={title}
          className="font-serif text-2xl sm:text-3xl font-normal tracking-tight text-[#202E1D]"
        />
        {description && (
          <p className="text-xs sm:text-sm text-[#202E1D]/70 max-w-2xl leading-relaxed font-sans">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0 flex items-center gap-2">{action}</div>}
    </div>
  );
}
