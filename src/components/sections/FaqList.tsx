"use client";

import { AnimatePresence, motion } from "motion/react";
import { useId, useState } from "react";
import type { Faq } from "@/data/types";
import { cn } from "@/lib/cn";
import { EASE_IN_OUT_QUART, EASE_OUT_EXPO } from "@/components/motion/easing";

/** Accordion of questions, styled like the Services list on the home page. */
export function FaqList({ items }: { items: Faq[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();

  return (
    <div className="border-t border-ink">
      {items.map((item, i) => {
        const isOpen = open === i;
        const panelId = `${baseId}-${i}`;
        return (
          <div key={item.question} className="border-b border-ink">
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="group flex w-full items-center justify-between gap-6 py-[clamp(1rem,1.6vw,1.5rem)] text-left"
              >
                <span
                  className={cn(
                    "text-[clamp(1.0625rem,0.95rem+0.5vw,1.5rem)] leading-snug transition-colors duration-500",
                    isOpen ? "text-brand" : "group-hover:text-brand",
                  )}
                >
                  {item.question}
                </span>
                <motion.svg
                  viewBox="0 0 14.4142 14.4142"
                  aria-hidden
                  className={cn("size-[13px] shrink-0 transition-colors duration-500", isOpen ? "text-brand" : "text-ink")}
                  initial={false}
                  animate={{ rotate: isOpen ? 0 : 45 }}
                  transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
                >
                  <path d="M0.707107 0.707142L13.7071 13.7071M13.7071 0.707107L0.707109 13.7071" stroke="currentColor" strokeWidth="2" />
                </motion.svg>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-label={item.question}
                  className="overflow-hidden"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.6, ease: EASE_IN_OUT_QUART }}
                >
                  <p className="max-w-[820px] pb-6 text-[clamp(1rem,0.95rem+0.2vw,1.125rem)] leading-[1.7] text-muted">
                    {item.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
