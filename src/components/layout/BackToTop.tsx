"use client";

import { AnimatePresence, motion } from "motion/react";
import { useLenis } from "lenis/react";
import { useEffect, useState } from "react";
import { EASE_OUT_EXPO } from "@/components/motion/easing";

/** Floating "back to top" button — appears once the visitor is more than a screen down. */
export function BackToTop() {
  const lenis = useLenis();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => setVisible(window.scrollY > window.innerHeight * 0.9);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  const toTop = () => {
    if (lenis) lenis.scrollTo(0, { duration: 1.4 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="back-to-top"
          type="button"
          onClick={toTop}
          aria-label="Back to top"
          title="Back to top"
          initial={{ opacity: 0, scale: 0.6, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 12 }}
          transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
          className="group fixed right-[max(16px,2vw)] bottom-[max(16px,2vw)] z-40 flex size-12 items-center justify-center rounded-full bg-ink text-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.45)] transition-colors duration-300 hover:bg-brand focus-visible:bg-brand"
        >
          <svg viewBox="0 0 23 23" aria-hidden className="size-5 transition-transform duration-300 group-hover:-translate-y-0.5" fill="none">
            <path d="M6 10.1364L11.5 4L17 10.1364M11.5 4V19" stroke="currentColor" strokeWidth="1.4" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
