"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useLenis } from "lenis/react";
import { useCallback, useEffect } from "react";
import type { SiteImage } from "@/data/types";
import { EASE_OUT_EXPO } from "@/components/motion/easing";

type LightboxProps = {
  title: string;
  images: SiteImage[];
  index: number | null;
  onChange: (index: number | null) => void;
};

function NavButton({ dir, onClick }: { dir: "prev" | "next"; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir === "prev" ? "Previous image" : "Next image"}
      className="group flex size-12 items-center justify-center rounded-full border border-white/40 text-white transition-colors duration-300 hover:border-brand hover:bg-brand"
    >
      <svg viewBox="0 0 23 23" className={`size-6 ${dir === "prev" ? "rotate-180" : ""}`} fill="none" aria-hidden>
        <path d="M12.8636 17L19 11.5L12.8636 6M19 11.5L4 11.5" stroke="currentColor" strokeWidth={1.4} />
      </svg>
    </button>
  );
}

export function Lightbox({ title, images, index, onChange }: LightboxProps) {
  const lenis = useLenis();
  const open = index !== null;
  const count = images.length;

  const go = useCallback(
    (step: number) => {
      if (index === null) return;
      onChange((index + step + count) % count);
    },
    [index, count, onChange],
  );

  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onChange(null);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      lenis?.start();
    };
  }, [open, go, onChange, lenis]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`${title} gallery`}
          className="fixed inset-0 z-[70] flex flex-col bg-black/95 text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center justify-between px-5 py-4 md:px-10">
            <p className="text-sm tracking-[0.08em] uppercase">
              {title}
              <span className="ml-4 text-white/50 tabular-nums">
                {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
              </span>
            </p>
            <button
              type="button"
              onClick={() => onChange(null)}
              aria-label="Close gallery"
              autoFocus
              className="flex size-12 items-center justify-center rounded-full transition-colors hover:bg-white/10"
            >
              <svg viewBox="0 0 14.4142 14.4142" className="size-4" aria-hidden>
                <path d="M0.707107 0.707142L13.7071 13.7071M13.7071 0.707107L0.707109 13.7071" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </button>
          </div>

          <div className="relative flex-1">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.div
                key={index}
                className="absolute inset-x-4 inset-y-2 md:inset-x-24"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.4}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -80) go(1);
                  else if (info.offset.x > 80) go(-1);
                }}
              >
                <Image
                  src={images[index].src}
                  alt={`${title} — image ${index + 1} of ${count}`}
                  fill
                  sizes="100vw"
                  className="pointer-events-none object-contain select-none"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-center gap-4 py-5">
            <NavButton dir="prev" onClick={() => go(-1)} />
            <NavButton dir="next" onClick={() => go(1)} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
