"use client";

import { motion } from "motion/react";
import { Fragment, type ElementType } from "react";
import { EASE_OUT_EXPO } from "./easing";

type TextRevealProps = {
  /** Plain text; each string in the array is forced onto its own line. */
  text: string | string[];
  as?: ElementType;
  className?: string;
  delay?: number;
  stagger?: number;
};

/**
 * Masked word-by-word reveal for display headings.
 * Screen readers get the full sentence through aria-label.
 */
export function TextReveal({
  text,
  as: Tag = "h2",
  className,
  delay = 0,
  stagger = 0.035,
}: TextRevealProps) {
  const lines = (Array.isArray(text) ? text : [text]).map((line) => line.split(" "));

  return (
    <Tag className={className} aria-label={lines.map((words) => words.join(" ")).join(" ")}>
      <motion.span
        aria-hidden
        className="block"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: stagger, delayChildren: delay } },
        }}
      >
        {lines.map((words, li) => (
          <span key={li} className="block">
            {words.map((word, wi) => (
              <Fragment key={`${li}-${wi}`}>
                <span className="inline-block overflow-hidden pb-[0.08em] align-top">
                  <motion.span
                    className="inline-block will-change-transform"
                    variants={{
                      hidden: { y: "110%" },
                      show: { y: "0%", transition: { duration: 1, ease: EASE_OUT_EXPO } },
                    }}
                  >
                    {word}
                  </motion.span>
                </span>
                {wi < words.length - 1 && " "}
              </Fragment>
            ))}
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
