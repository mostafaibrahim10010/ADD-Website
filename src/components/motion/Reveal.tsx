"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import { EASE_OUT_EXPO } from "./easing";

type RevealProps = HTMLMotionProps<"div"> & {
  delay?: number;
  /** Distance in px the element travels up while fading in. */
  y?: number;
};

/** Fades + lifts content into place the first time it enters the viewport. */
export function Reveal({ delay = 0, y = 40, children, ...props }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1.1, ease: EASE_OUT_EXPO, delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

type StaggerProps = HTMLMotionProps<"div"> & {
  stagger?: number;
  delay?: number;
};

/** Parent that staggers its <StaggerItem> children on enter. */
export function Stagger({ stagger = 0.06, delay = 0, children, ...props }: StaggerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, ...props }: HTMLMotionProps<"div">) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE_OUT_EXPO } },
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
