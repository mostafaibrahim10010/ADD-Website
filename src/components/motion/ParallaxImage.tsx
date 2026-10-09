"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { cn } from "@/lib/cn";
import { EASE_IN_OUT_QUART } from "./easing";

type ParallaxImageProps = {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Parallax travel as a percentage of the frame height. */
  strength?: number;
  objectPosition?: string;
};

/**
 * Image frame that wipes open on enter and drifts with scroll.
 * The frame (className) controls the size; the image always covers it.
 *
 * The in-view observer sits on the unclipped frame — observing the clipped
 * layer itself never reports an intersection.
 */
export function ParallaxImage({
  src,
  alt,
  className,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority,
  strength = 8,
  objectPosition = "50% 50%",
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // The layer is (100 + 2·strength)% tall and `y` is relative to that height,
  // so scale the travel down to never expose the frame's edges.
  const travel = strength / (1 + (2 * strength) / 100);
  const y = useTransform(scrollYProgress, [0, 1], [`-${travel}%`, `${travel}%`]);

  return (
    <motion.div
      ref={ref}
      className={cn("relative overflow-hidden", className)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
    >
      <motion.div
        className="absolute inset-0 overflow-hidden bg-surface"
        variants={{
          hidden: { clipPath: "inset(100% 0% 0% 0%)" },
          show: { clipPath: "inset(0% 0% 0% 0%)", transition: { duration: 1.4, ease: EASE_IN_OUT_QUART } },
        }}
      >
        <motion.div
          className="absolute inset-x-0"
          style={{ y, top: `-${strength}%`, bottom: `-${strength}%` }}
        >
          <motion.div
            className="relative size-full"
            variants={{
              hidden: { scale: 1.2 },
              show: { scale: 1, transition: { duration: 1.8, ease: EASE_IN_OUT_QUART } },
            }}
          >
            <Image
              src={src}
              alt={alt}
              fill
              sizes={sizes}
              priority={priority}
              className="object-cover"
              style={{ objectPosition }}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
