"use client";

import { ReactLenis } from "lenis/react";
import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/** Global client providers: smooth scrolling + reduced-motion aware animations. */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <ReactLenis root options={{ lerp: 0.1, anchors: true }}>
        {children}
      </ReactLenis>
    </MotionConfig>
  );
}
