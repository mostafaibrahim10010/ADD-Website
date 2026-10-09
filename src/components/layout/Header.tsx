"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useLenis } from "lenis/react";
import { useEffect, useState } from "react";
import { mainNav, site } from "@/data/site";
import { cn } from "@/lib/cn";
import { PillLink } from "@/components/ui/PillButton";
import { EASE_IN_OUT_QUART, EASE_OUT_EXPO } from "@/components/motion/easing";
import { LogoType } from "./Logo";

function isActive(pathname: string, href: string) {
  if (href.includes("#")) return false;
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function Header() {
  const pathname = usePathname();
  const lenis = useLenis();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  // Close the menu on navigation (render-phase reset keyed on pathname).
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (open) lenis?.stop();
    else lenis?.start();
  }, [open, lenis]);

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: EASE_OUT_EXPO, delay: 0.2 }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500",
          scrolled && !open
            ? "bg-white/85 shadow-[0_1px_0_rgba(0,0,0,0.08)] backdrop-blur-md"
            : "bg-transparent",
        )}
      >
        <div
          className={cn(
            "container-wide flex h-24 items-center justify-between gap-6 transition-[height,padding] duration-500 ease-out-expo",
            // At the top of the page the bar matches the Figma frame (y 43 → 125).
            !scrolled && "lg:h-[125px] lg:pt-[43px]",
          )}
        >
          <LogoType />

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-[clamp(1.5rem,2.7vw,3.25rem)]">
              {mainNav.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "group relative block py-1 text-[clamp(1rem,0.85rem+0.3vw,1.125rem)] leading-[26px] tracking-[0.36px] whitespace-nowrap",
                        active ? "font-semibold" : "font-normal",
                      )}
                    >
                      {item.label}
                      <span
                        aria-hidden
                        className={cn(
                          "absolute inset-x-0 -bottom-0.5 h-px origin-left bg-current transition-transform duration-500 ease-out-expo",
                          active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                        )}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block">
              <PillLink href="/contact" className="w-[144px]">
                Contact us
              </PillLink>
            </div>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="relative z-50 flex size-11 flex-col items-center justify-center gap-[7px] lg:hidden"
            >
              <motion.span
                className="block h-[1.5px] w-7 bg-ink"
                animate={open ? { rotate: 45, y: 4.25 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
              />
              <motion.span
                className="block h-[1.5px] w-7 bg-ink"
                animate={open ? { rotate: -45, y: -4.25 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
              />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-40 flex flex-col bg-white px-5 pt-28 pb-10 lg:hidden"
            initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
            transition={{ duration: 0.8, ease: EASE_IN_OUT_QUART }}
          >
            <nav aria-label="Mobile">
              <motion.ul
                className="flex flex-col"
                initial="hidden"
                animate="show"
                variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.3 } } }}
              >
                {mainNav.map((item) => (
                  <motion.li
                    key={item.href}
                    className="overflow-hidden border-b border-ink/15"
                    variants={{
                      hidden: { opacity: 0, y: 40 },
                      show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE_OUT_EXPO } },
                    }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center justify-between py-5 text-[clamp(1.75rem,7vw,2.5rem)] leading-tight",
                        isActive(pathname, item.href) && "text-brand",
                      )}
                    >
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
              </motion.ul>
            </nav>
            <motion.div
              className="mt-auto flex flex-col gap-4 text-muted"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.7 } }}
            >
              <a href={`mailto:${site.email}`} className="text-lg text-ink">
                {site.email}
              </a>
              <PillLink href="/contact" onClick={() => setOpen(false)} className="self-start">
                Contact us
              </PillLink>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
