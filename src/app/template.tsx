"use client";

import { motion } from "motion/react";
import { EASE_OUT_EXPO } from "@/components/motion/easing";

/**
 * Soft fade on every route change. Opacity only: a transform here would turn
 * this wrapper into the containing block for fixed overlays (lightbox).
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.9, ease: EASE_OUT_EXPO }}
    >
      {children}
    </motion.div>
  );
}
