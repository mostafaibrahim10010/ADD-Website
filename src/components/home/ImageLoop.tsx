"use client";

import Image from "next/image";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import { loopImages } from "@/data/content";
import { EASE_OUT_EXPO } from "@/components/motion/easing";
import { cn } from "@/lib/cn";

/** px per second at rest — scrolling the page speeds the strip up. */
const BASE_SPEED = 45;

/** Endless, scroll-reactive strip of the studio's illustrations. */
export function ImageLoop() {
  const reduceMotion = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const [setWidth, setSetWidth] = useState(0);
  const [hovered, setHovered] = useState(false);

  const x = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 300 });
  const boost = useTransform(smoothVelocity, [-2000, 0, 2000], [4, 0, 4], { clamp: false });

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const first = el.firstElementChild as HTMLElement | null;
    if (!first) return;
    const measure = () => setSetWidth(first.offsetWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(first);
    return () => ro.disconnect();
  }, []);

  useAnimationFrame((_, delta) => {
    if (reduceMotion || !setWidth) return;
    const factor = hovered ? 0.25 : 1;
    const move = (BASE_SPEED * (1 + Math.abs(boost.get())) * factor * delta) / 1000;
    let next = x.get() - move;
    if (next <= -setWidth) next += setWidth;
    x.set(next);
  });

  return (
    <section aria-label="Studio illustrations" className="overflow-hidden">
      <motion.div
        ref={trackRef}
        className="flex w-max"
        style={{ x }}
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.4, ease: EASE_OUT_EXPO, delay: 0.9 }}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
      >
        {[0, 1].map((copy) => (
          <ul key={copy} aria-hidden={copy === 1} className="flex shrink-0 gap-[11px] pr-[11px]">
            {loopImages.map((src, i) => (
              <li
                key={src}
                className={cn(
                  "group relative h-[clamp(220px,26vw,499px)] overflow-hidden bg-surface",
                  // add-home-07 is the one wide frame (600 × 499) in the Figma loop.
                  i === 6 ? "aspect-[600/499]" : "aspect-square",
                )}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="(min-width: 1920px) 600px, 26vw"
                  priority={copy === 0 && i < 4}
                  className="object-cover transition-transform duration-[1.2s] ease-out-expo group-hover:scale-[1.06]"
                />
              </li>
            ))}
          </ul>
        ))}
      </motion.div>
    </section>
  );
}
