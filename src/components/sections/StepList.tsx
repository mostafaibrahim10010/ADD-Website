"use client";

import { motion } from "motion/react";
import type { Step } from "@/data/types";
import { cn } from "@/lib/cn";
import { EASE_OUT_EXPO } from "@/components/motion/easing";

type StepListProps = {
  steps: Step[];
  /** Grid columns at desktop width. */
  columns?: 3 | 4 | 5;
};

const COLS = { 3: "lg:grid-cols-3", 4: "lg:grid-cols-4", 5: "lg:grid-cols-5" };

/** Numbered process steps on a rule that draws across as it enters view. */
export function StepList({ steps, columns = 5 }: StepListProps) {
  return (
    <motion.ol
      className={cn("relative grid gap-x-8 gap-y-10 sm:grid-cols-2", COLS[columns])}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      variants={{ show: { transition: { staggerChildren: 0.12 } } }}
    >
      {steps.map((step, i) => (
        <motion.li
          key={step.title}
          className="relative pt-8"
          variants={{
            hidden: { opacity: 0, y: 30 },
            show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE_OUT_EXPO } },
          }}
        >
          <motion.span
            aria-hidden
            className="absolute inset-x-0 top-0 h-px origin-left bg-ink"
            variants={{
              hidden: { scaleX: 0 },
              show: { scaleX: 1, transition: { duration: 1.2, ease: EASE_OUT_EXPO } },
            }}
          />
          <span aria-hidden className="absolute -top-[5px] left-0 size-[11px] rounded-full bg-brand" />
          <p className="text-sm tracking-[0.2em] text-brand tabular-nums">{String(i + 1).padStart(2, "0")}</p>
          <h3 className="mt-3 text-[clamp(1.125rem,1rem+0.4vw,1.375rem)] leading-snug font-medium">{step.title}</h3>
          <p className="mt-3 text-[15px] leading-[1.65] text-muted">{step.description}</p>
        </motion.li>
      ))}
    </motion.ol>
  );
}
