"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionValueEvent } from "framer-motion";
import { cn } from "@/lib/utils";

export interface TextRevealOnScrollProps {
  text?: string;
  children?: React.ReactNode;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "p" | "span" | "div";
  mutedColor?: string;
  primaryColor?: string;
  color?: string;
  mode?: "word" | "character";
  replay?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

interface RevealItemProps {
  children: React.ReactNode;
  progress: any;
  range: [number, number];
  mutedColor: string;
  primaryColor: string;
}

function RevealItem({ children, progress, range, mutedColor, primaryColor }: RevealItemProps) {
  const color = useTransform(progress, range, [mutedColor, primaryColor]);
  const opacity = useTransform(progress, range, [0.35, 1]);

  return (
    <motion.span style={{ color, opacity }} className="inline-block transition-colors">
      {children}
    </motion.span>
  );
}

export function TextRevealOnScroll({
  text,
  children,
  as: Component = "h2",
  mutedColor = "rgba(32, 46, 29, 0.22)",
  primaryColor = "#202E1D",
  color,
  mode = "word",
  replay = true,
  className,
  style
}: TextRevealOnScrollProps) {
  const resolvedPrimaryColor = color || primaryColor;
  const containerRef = useRef<HTMLElement | null>(null);

  // Extract raw string from text or children
  const rawText =
    text ||
    (typeof children === "string"
      ? children
      : Array.isArray(children)
      ? children.filter((c) => typeof c === "string").join("")
      : "");

  const { scrollYProgress } = useScroll({
    target: containerRef as any,
    offset: ["start 0.9", "end 0.4"]
  });

  const maxProgress = useMotionValue(0);
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest > maxProgress.get()) {
      maxProgress.set(latest);
    }
  });

  const sourceProgress = replay ? scrollYProgress : maxProgress;
  const progressToUse = useSpring(sourceProgress, {
    stiffness: 120,
    damping: 28,
    mass: 1,
    restDelta: 0.001
  });

  if (!rawText) {
    return <Component className={className} style={style}>{children}</Component>;
  }

  // Split into tokens based on mode
  const items =
    mode === "character"
      ? rawText.split("")
      : rawText.match(/([\S]+|\s+)/g) || [];

  let totalValids = 0;
  items.forEach((item) => {
    if (item.trim().length > 0) totalValids++;
  });

  let currentIdx = 0;

  return (
    <Component
      ref={containerRef as any}
      className={cn("inline-block select-none", className)}
      style={{
        ...style,
        color: mutedColor
      }}
    >
      <span aria-hidden="true">
        {items.map((itemStr, idx) => {
          if (itemStr.trim().length === 0 && itemStr !== "\n") {
            return (
              <span key={`space-${idx}`} className="inline">
                {itemStr}
              </span>
            );
          }
          if (itemStr === "\n") {
            return <br key={`br-${idx}`} />;
          }

          const start = currentIdx / Math.max(totalValids, 1);
          const end = (currentIdx + 1) / Math.max(totalValids, 1);
          currentIdx++;

          return (
            <RevealItem
              key={`reveal-${idx}`}
              progress={progressToUse}
              range={[start, end]}
              mutedColor={mutedColor}
              primaryColor={resolvedPrimaryColor}
            >
              {itemStr}
            </RevealItem>
          );
        })}
      </span>
      <span className="sr-only">{rawText}</span>
    </Component>
  );
}

export default TextRevealOnScroll;
