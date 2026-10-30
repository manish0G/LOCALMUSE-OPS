import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "neutral" | "success" | "warning" | "danger" | "info" | "outline";
  size?: "sm" | "md";
  dot?: boolean;
  pulse?: boolean;
}

export function Badge({
  className,
  variant = "neutral",
  size = "md",
  dot = false,
  pulse = false,
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    neutral: "bg-[#8F9A82]/15 text-[#202E1D] border-[#8F9A82]/30",
    success: "bg-emerald-50 text-emerald-800 border-emerald-200",
    warning: "bg-[#EDD88B]/40 text-[#544616] border-[#EDD88B]/80 font-semibold",
    danger: "bg-rose-50 text-rose-800 border-rose-200",
    info: "bg-[#8F9A82]/20 text-[#202E1D] border-[#8F9A82]/40 font-medium",
    outline: "border-[#202E1D]/20 text-[#202E1D]/80 bg-white/50"
  };

  const dotColor = {
    neutral: "bg-[#8F9A82]",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    danger: "bg-rose-500",
    info: "bg-[#8F9A82]",
    outline: "bg-[#202E1D]"
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[10px] gap-1 font-mono tracking-wider uppercase",
    md: "px-2.5 py-1 text-xs gap-1.5 font-mono tracking-wider"
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium border rounded-full select-none",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full shrink-0",
            dotColor[variant],
            pulse && "animate-pulse"
          )}
        />
      )}
      <span>{children}</span>
    </span>
  );
}
