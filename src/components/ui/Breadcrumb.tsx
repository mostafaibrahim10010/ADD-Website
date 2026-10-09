"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { EASE_OUT_EXPO } from "@/components/motion/easing";
import { ArchIcon } from "./SectionHeading";

/** "● Home \ About Us ───────" trail shown under the header on inner pages. */
export function Breadcrumb({ current }: { current: string }) {
  return (
    <nav aria-label="Breadcrumb" className="flex h-[31px] w-full items-center gap-3">
      <motion.ol
        className="flex shrink-0 items-center gap-[13px] text-[clamp(1rem,0.9rem+0.3vw,1.25rem)] tracking-[0.4px]"
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, ease: EASE_OUT_EXPO, delay: 0.3 }}
      >
        <li>
          <ArchIcon />
        </li>
        <li className="flex items-center gap-1">
          <Link href="/" className="transition-colors hover:text-brand">
            Home
          </Link>
          <span aria-hidden>\</span>
        </li>
        <li aria-current="page" className="font-semibold">
          {current}
        </li>
      </motion.ol>
      <motion.span
        aria-hidden
        className="h-px flex-1 origin-left bg-line"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.4, ease: EASE_OUT_EXPO, delay: 0.45 }}
      />
    </nav>
  );
}
