"use client";

import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import { EASE_OUT_EXPO } from "@/components/motion/easing";

/*
 * Geometry from the Figma "Scroll-Linked Animation" frame (1192 × 401).
 * Percentages keep the mark fluid; the quote uses container-query units so it
 * scales exactly with the letters.
 */
const LETTER_A = "M401.921 400.766H0V200.188C0 89.6853 90.0141 0 201 0C311.986 0 402 89.6853 402 200.266V400.845L401.921 400.766Z";
const LETTER_D_MID = "M205.16 399.845C318.266 399.845 410 310.296 410 199.884C410 89.4709 318.266 0 205.16 0H0V399.845H205.16Z";
const LETTER_D_END = "M201.157 399.845C312.056 399.845 402 310.296 402 199.884C402 89.4709 312.056 0 201.157 0H0V399.845H201.157Z";

// Line breaks follow the Figma frame.
const QUOTE = [
  "“INNOVATION AND INTEGRITY IN EVERY BLUEPRINT;",
  "YOUR VISION BROUGHT TO LIFE WITH OUR",
  "CRAFTSMANSHIP.”",
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  // Scroll: the letters drift apart (the third Figma keyframe) while the mark sinks.
  const spreadA = useTransform(progress, [0, 1], ["0%", "-22%"]);
  const spreadD = useTransform(progress, [0, 1], ["0%", "22%"]);
  const lift = useTransform(progress, [0, 1], ["0%", "18%"]);
  const scale = useTransform(progress, [0, 1], [1, 0.92]);
  const quoteOpacity = useTransform(progress, [0, 0.55], [1, 0]);

  return (
    <section ref={ref} aria-label="Introduction" className="relative pt-[clamp(120px,9.8vw,188px)] pb-[clamp(3rem,5.5vw,6.625rem)]">
      <h1 className="sr-only">ADD Architects — {QUOTE.join(" ")}</h1>
      <motion.div
        aria-hidden
        className="@container relative mx-auto aspect-[1192/401] w-[min(1192px,calc(100%-2.5rem))]"
        style={{ y: lift, scale }}
      >
        {/* A — slides out from behind the first D */}
        <motion.div
          className="absolute top-[0.25%] bottom-0 left-0 w-[33.72%]"
          initial={{ x: "66%", opacity: 0 }}
          animate={{ x: "0%", opacity: 1 }}
          transition={{
            x: { duration: 1.6, ease: EASE_OUT_EXPO, delay: 0.45 },
            // Solid red almost immediately, so the overlap never reads as pink.
            opacity: { duration: 0.15, delay: 0.45 },
          }}
        >
          <motion.svg viewBox="0 0 402 400.845" className="size-full fill-brand" style={{ x: spreadA }}>
            <path d={LETTER_A} />
          </motion.svg>
        </motion.div>

        {/* D (middle) — the anchor shape that appears first */}
        <motion.div
          className="absolute top-[0.25%] bottom-0 left-[33.56%] z-10 w-[34.4%]"
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ scale: { duration: 1.1, ease: EASE_OUT_EXPO }, opacity: { duration: 0.2 } }}
        >
          <svg viewBox="0 0 410 399.845" className="size-full fill-brand">
            <path d={LETTER_D_MID} />
          </svg>
        </motion.div>

        {/* D (end) — slides out the other way */}
        <motion.div
          className="absolute top-0 bottom-0 left-[66.28%] w-[33.72%]"
          initial={{ x: "-66%", opacity: 0 }}
          animate={{ x: "0%", opacity: 1 }}
          transition={{
            x: { duration: 1.6, ease: EASE_OUT_EXPO, delay: 0.45 },
            // Solid red almost immediately, so the overlap never reads as pink.
            opacity: { duration: 0.15, delay: 0.45 },
          }}
        >
          <motion.svg viewBox="0 0 402 399.845" className="size-full fill-brand" style={{ x: spreadD }}>
            <path d={LETTER_D_END} />
          </motion.svg>
        </motion.div>

        {/* Quote — set inside the mark from small tablets up */}
        <motion.div
          className="absolute inset-x-[-1%] top-[29.5%] z-20 hidden text-center sm:block text-[3.1cqw] leading-[4.7cqw] tracking-[0.02em] text-white uppercase"
          style={{ opacity: quoteOpacity }}
        >
          {QUOTE.map((line, i) => (
            <span key={line} className="block overflow-hidden">
              <motion.span
                className="block"
                initial={{ y: "105%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 1.2, ease: EASE_OUT_EXPO, delay: 1.25 + i * 0.12 }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </motion.div>
      </motion.div>

      {/* On phones the in-mark quote would be ~11px, so it sits below the mark instead */}
      <motion.p
        aria-hidden
        className="mx-auto mt-7 max-w-[22rem] px-5 text-center text-[13px] leading-[1.7] tracking-[0.08em] uppercase sm:hidden"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: EASE_OUT_EXPO, delay: 1.25 }}
      >
        {QUOTE.join(" ")}
      </motion.p>
    </section>
  );
}
