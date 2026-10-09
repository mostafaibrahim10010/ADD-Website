"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { EASE_OUT_EXPO } from "@/components/motion/easing";

/** The arch-shaped bullet that precedes every section label. */
export function ArchIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 18.6924 18.5516"
      aria-hidden
      className={cn("h-[18.55px] w-[18.69px] shrink-0 fill-current", className)}
    >
      <path d="M18.6888 18.548H0V9.26493C0 4.15075 4.18552 0 9.34621 0C14.5069 0 18.6924 4.15075 18.6924 9.26855V18.5516L18.6888 18.548Z" />
    </svg>
  );
}

type SectionHeadingProps = {
  children: ReactNode;
  className?: string;
  as?: "h2" | "p" | "nav";
};

/** "● About Us ─────────" — label followed by a rule that draws itself in. */
export function SectionHeading({ children, className, as = "h2" }: SectionHeadingProps) {
  const Tag = as;
  return (
    <div className={cn("flex h-[31px] w-full items-center gap-3", className)}>
      <motion.div
        className="flex shrink-0 items-center gap-[13px]"
        initial={{ opacity: 0, x: -16 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.9, ease: EASE_OUT_EXPO }}
      >
        <ArchIcon />
        <Tag className="text-[clamp(1.125rem,1rem+0.5vw,1.5625rem)] leading-[31px] tracking-[0.5px] whitespace-nowrap">
          {children}
        </Tag>
      </motion.div>
      <motion.span
        aria-hidden
        className="h-px flex-1 origin-left bg-line"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 1.4, ease: EASE_OUT_EXPO, delay: 0.15 }}
      />
    </div>
  );
}
