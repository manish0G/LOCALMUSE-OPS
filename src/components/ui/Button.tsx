import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8F9A82] disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer";

    const variantStyles = {
      primary:
        "bg-[#202E1D] text-[#F6F4EB] hover:bg-[#172215] shadow-xs active:scale-[0.99]",
      secondary:
        "bg-[#EDD88B] text-[#202E1D] hover:bg-[#E4CD7B] font-semibold shadow-xs active:scale-[0.99]",
      outline:
        "border border-[#202E1D]/20 text-[#202E1D] bg-white/70 hover:bg-[#FAF8F2] hover:border-[#202E1D]/40 active:bg-white",
      ghost:
        "text-[#202E1D]/75 hover:text-[#202E1D] hover:bg-[#8F9A82]/15 active:bg-[#8F9A82]/20",
      danger:
        "bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100"
    };

    const sizeStyles = {
      sm: "px-3 py-1.5 text-xs rounded-full gap-1.5",
      md: "px-4 py-2 text-xs sm:text-sm rounded-full gap-2",
      lg: "px-5 py-2.5 text-sm sm:text-base rounded-full gap-2.5 font-semibold"
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {loading ? (
          <span className="inline-block w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          leftIcon
        )}
        <span>{children}</span>
        {!loading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";
