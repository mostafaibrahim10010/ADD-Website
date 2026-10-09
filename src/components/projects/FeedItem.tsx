"use client";

import Image from "next/image";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useRef, useState, type CSSProperties, type MouseEvent, type PointerEvent } from "react";
import type { Project } from "@/data/types";
import { cn } from "@/lib/cn";
import { EASE_OUT_EXPO } from "@/components/motion/easing";
import { Lightbox } from "./Lightbox";
import { ShareLinks } from "./ShareLinks";

/** big.dk's open/close curve and timing for the image resize. */
const RESIZE = "0.78s cubic-bezier(0.45, 0, 0.55, 1)";

/*
 * Dimensions from the Figma "Projects" row (node 631:328) at 1920px, scaled with
 * the viewport via container units (1cqw = 19.2px at 1920):
 *   row / image height 522 · lead image 1033 × 522 · meta column 253, 46 to the image
 *   description 367 wide, 55 either side · gallery images 766 × 522, 40 apart
 *   meta: title 20 SemiBold · location/year 16 · labels 14 #797979 · values 12 / 0.72 tracking
 */
const ROW_VARS = {
  "--h": "clamp(240px, 27.19cqw, 522px)",
  "--w1": "clamp(260px, 30cqw, 560px)", // collapsed (big.dk-style) lead width
  "--w2": "calc(var(--h) * 1033 / 522)", // open lead width — Figma 1033
  "--meta": "clamp(170px, 13.18cqw, 253px)",
  "--gap": "clamp(20px, 2.4cqw, 46px)",
  "--dgap": "clamp(22px, 2.86cqw, 55px)",
  "--igap": "clamp(14px, 2.08cqw, 40px)",
  "--dw": "clamp(230px, 19.11cqw, 367px)",
  "--gutter": "max(20px, calc((100cqw - 1570px) / 2))",
  "--ml1": "calc(50cqw - var(--w1) / 2)",
  "--ml2": "calc(var(--gutter) + var(--meta) + var(--gap))", // Figma x = 474
  "--pt": "calc(var(--h) * 50 / 522)", // title sits 50px below the image top
} as CSSProperties;

type FeedItemProps = {
  project: Project;
  open: boolean;
  priority?: boolean;
  onToggle: (slug: string) => void;
};

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[clamp(12px,0.7292vw,14px)] leading-normal text-meta">{label}</dt>
      <dd className="text-[12px] leading-normal tracking-[0.72px]">{value}</dd>
    </div>
  );
}

/**
 * One project in the feed. Collapsed (big.dk): title, location and year beside
 * a centred image. Open (Figma row): the image grows to 1033 × 522, the meta
 * column gains client / status / size / share, and the description plus the
 * remaining images slide in as a draggable strip.
 */
export function FeedItem({ project, open, priority, onToggle }: FeedItemProps) {
  const [first, ...rest] = project.images;
  const href = `/projects/${project.slug}`;

  const rowRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, startX: 0, startScroll: 0, moved: 0 });
  const pointer = useRef<{ x: number; y: number; fine: boolean } | null>(null);
  const [dragging, setDragging] = useState(false);
  const [cursor, setCursor] = useState(false);
  const [explored, setExplored] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [loaded, setLoaded] = useState(false);
  const progress = useMotionValue(0);
  const smoothProgress = useSpring(progress, { stiffness: 200, damping: 40 });
  const cx = useSpring(0, { stiffness: 500, damping: 40, mass: 0.3 });
  const cy = useSpring(0, { stiffness: 500, damping: 40, mass: 0.3 });

  /**
   * Keep the DRAG cursor glued to the real mouse while open — including the
   * moment the project opens (the mouse is already over it) and while the page
   * glides the row into place underneath a still mouse.
   */
  useEffect(() => {
    if (!open) return;
    const place = (jump: boolean) => {
      const p = pointer.current;
      const row = rowRef.current;
      const scroller = scrollerRef.current;
      if (!p || !p.fine || !row || !scroller) return;
      const rr = row.getBoundingClientRect();
      const sr = scroller.getBoundingClientRect();
      if (jump) {
        cx.jump(p.x - rr.left);
        cy.jump(p.y - rr.top);
      } else {
        cx.set(p.x - rr.left);
        cy.set(p.y - rr.top);
      }
      setCursor(p.x >= sr.left && p.x <= sr.right && p.y >= sr.top && p.y <= sr.bottom);
    };
    const onMove = (e: globalThis.PointerEvent) => {
      pointer.current = { x: e.clientX, y: e.clientY, fine: e.pointerType === "mouse" };
      place(false);
    };
    const onScroll = () => place(true);
    const first = requestAnimationFrame(() => place(true));
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(first);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, [open, cx, cy]);

  const toggle = (e: MouseEvent) => {
    // Keep real links for new tabs / no-JS; otherwise expand in place.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    if (drag.current.moved > 6) return;
    // The click position seeds the DRAG cursor so it shows straight away.
    pointer.current = { x: e.clientX, y: e.clientY, fine: window.matchMedia("(pointer: fine)").matches };
    onToggle(project.slug);
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    drag.current.moved = 0;
    if (!open || e.pointerType !== "mouse" || !scrollerRef.current) return;
    drag.current = { active: true, startX: e.clientX, startScroll: scrollerRef.current.scrollLeft, moved: 0 };
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag.current.active || !scrollerRef.current) return;
    const dx = e.clientX - drag.current.startX;
    drag.current.moved = Math.max(drag.current.moved, Math.abs(dx));
    if (drag.current.moved > 6 && !dragging) setDragging(true);
    scrollerRef.current.scrollLeft = drag.current.startScroll - dx;
  };
  const endDrag = () => {
    drag.current.active = false;
    setDragging(false);
  };
  const onScroll = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    progress.set(max > 0 ? el.scrollLeft / max : 0);
    if (el.scrollLeft > 40 && !explored) setExplored(true);
  };

  const showCursor = open && cursor;
  const resize = { transition: `width ${RESIZE}, margin-left ${RESIZE}, padding-top ${RESIZE}` };

  return (
    <article id={project.slug} aria-labelledby={`${project.slug}-title`} className="@container" style={ROW_VARS}>
      <motion.div
        ref={rowRef}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 1, ease: EASE_OUT_EXPO }}
        className="relative"
      >
        <div
          ref={scrollerRef}
          onScroll={onScroll}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
          className={cn(
            "no-scrollbar select-none",
            open ? "overflow-x-auto overflow-y-hidden overscroll-x-contain md:cursor-none" : "overflow-visible",
          )}
          role={open ? "region" : undefined}
          aria-label={open ? `${project.title} gallery` : undefined}
        >
          {/* Room for the full meta column on shorter screens; animates so neighbours never jump. */}
          <div
            className={cn("flex w-max items-start pr-[5cqw]", open ? "md:min-h-[360px]" : "md:min-h-0")}
            style={{ transition: `min-height ${RESIZE}` }}
          >
            {/* Lead image — width and offset animate between the two states */}
            <div
              className={cn(
                "relative shrink-0",
                "ml-[5cqw] w-[90cqw]", // mobile: meta stacks above
                open ? "md:ml-[var(--ml2)] md:w-[var(--w2)]" : "md:ml-[var(--ml1)] md:w-[var(--w1)]",
              )}
              style={resize}
            >
              {/* Meta column: hangs left of the image and spans its full height (Figma) */}
              <div
                className={cn(
                  "mb-4 flex flex-col gap-5 md:absolute md:inset-y-0 md:right-full md:mr-[var(--gap)] md:mb-0 md:w-[var(--meta)] md:justify-between md:gap-0 md:text-right",
                  open ? "md:pt-[var(--pt)]" : "md:pt-0",
                )}
                style={resize}
              >
                <a href={href} onClick={toggle} draggable={false} className="group block" aria-expanded={open}>
                  <h2
                    id={`${project.slug}-title`}
                    className="text-[clamp(17px,1.0417vw,20px)] leading-tight font-semibold transition-colors duration-500 group-hover:text-brand"
                  >
                    {project.title}
                  </h2>
                  <p className="mt-1 text-[clamp(14px,0.8333vw,16px)] leading-normal">{project.location}</p>
                  <p className="text-[clamp(14px,0.8333vw,16px)] leading-normal">{project.year}</p>
                </a>

                <AnimatePresence initial={false}>
                  {open && (
                    <motion.dl
                      key="fields"
                      className="grid grid-cols-3 gap-x-6 gap-y-3 md:mt-[calc(var(--h)*18/522)] md:flex md:flex-col md:gap-y-[clamp(7px,0.57vw,11px)]"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.35 } }}
                      exit={{ opacity: 0, transition: { duration: 0.15 } }}
                    >
                      <Field label="CLIENT" value={project.client} />
                      <Field label="STATUS" value={project.status.trim()} />
                      <Field label="SIZE M2/FT2" value={project.size} />
                    </motion.dl>
                  )}
                </AnimatePresence>

                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      key="share"
                      className="flex items-end justify-between gap-6 md:flex-col md:items-end md:justify-start md:gap-3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, transition: { duration: 0.6, delay: 0.45 } }}
                      exit={{ opacity: 0, transition: { duration: 0.15 } }}
                    >
                      <button
                        type="button"
                        onClick={() => onToggle(project.slug)}
                        className="order-2 flex items-center gap-1.5 text-[11px] tracking-[0.1em] text-meta uppercase transition-colors hover:text-brand md:order-1"
                      >
                        Close
                        <svg viewBox="0 0 14.4142 14.4142" aria-hidden className="size-2">
                          <path d="M0.707107 0.707142L13.7071 13.7071M13.7071 0.707107L0.707109 13.7071" stroke="currentColor" strokeWidth="2" />
                        </svg>
                      </button>
                      <div className="order-1 md:order-2">
                        <ShareLinks slug={project.slug} title={project.title} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <a
                href={href}
                draggable={false}
                onClick={(e) => {
                  if (open) {
                    e.preventDefault();
                    if (drag.current.moved <= 6) setLightbox(0);
                    return;
                  }
                  toggle(e);
                }}
                className="relative block aspect-[1033/522] overflow-hidden bg-surface"
                aria-label={open ? `Enlarge ${project.title} image 1` : `Open ${project.title}`}
              >
                <Image
                  src={first.src}
                  alt={`${project.title}, ${project.location}`}
                  fill
                  draggable={false}
                  priority={priority}
                  sizes="(min-width: 768px) 1033px, 90vw"
                  onLoad={() => setLoaded(true)}
                  className={cn("object-cover transition-opacity duration-700", loaded ? "opacity-100" : "opacity-0")}
                />
              </a>
            </div>

            {/* Open-state strip: description + remaining images (Figma spacing) */}
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  key="strip"
                  className="flex shrink-0 items-start gap-[var(--igap)] pl-[var(--dgap)]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                >
                  <motion.p
                    className="mr-[calc(var(--dgap)_-_var(--igap))] w-[var(--dw)] shrink-0 overflow-y-auto md:text-justify text-[clamp(13px,0.73vw,14px)] leading-[1.5] tracking-[0.28px] text-ink-soft md:h-[var(--h)]"
                    initial={{ opacity: 0, x: 60 }}
                    animate={{ opacity: 1, x: 0, transition: { duration: 1, ease: EASE_OUT_EXPO, delay: 0.45 } }}
                    data-lenis-prevent
                  >
                    {project.description}
                  </motion.p>
                  {rest.map((img, i) => (
                    <motion.button
                      key={img.src}
                      type="button"
                      onClick={() => drag.current.moved <= 6 && setLightbox(i + 1)}
                      className="relative aspect-[766/522] h-[60cqw] shrink-0 overflow-hidden bg-surface md:h-[var(--h)]"
                      initial={{ opacity: 0, x: 80 }}
                      animate={{
                        opacity: 1,
                        x: 0,
                        transition: { duration: 1.1, ease: EASE_OUT_EXPO, delay: 0.5 + Math.min(i, 5) * 0.07 },
                      }}
                      aria-label={`Enlarge ${project.title} image ${i + 2} of ${project.images.length}`}
                    >
                      <Image src={img.src} alt="" fill draggable={false} sizes="(min-width: 768px) 766px, 80vw" className="object-cover" />
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* DRAG cursor — appears the moment the project opens */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute top-0 left-0 z-10 hidden size-[84px] items-center justify-center rounded-full bg-brand text-[11px] font-medium tracking-[0.18em] text-white md:flex"
          style={{ x: cx, y: cy, translateX: "-50%", translateY: "-50%" }}
          initial={false}
          animate={{ scale: showCursor ? (dragging ? 0.8 : 1) : 0, opacity: showCursor ? 1 : 0 }}
          transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
        >
          DRAG
        </motion.div>

        {/* Progress line + hint, in the gap below the row (outside the layout flow) */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute right-[5cqw] -bottom-7 left-[5cqw] flex items-center gap-4 md:left-[var(--ml2)]"
          initial={false}
          animate={{ opacity: open ? 1 : 0 }}
          transition={{ duration: 0.4, delay: open ? 0.6 : 0 }}
        >
          <div className="h-px flex-1 bg-ink/10">
            <motion.div className="h-full origin-left bg-ink" style={{ scaleX: smoothProgress }} />
          </div>
          <motion.span
            className="flex shrink-0 items-center gap-2 text-[11px] tracking-[0.14em] text-meta uppercase"
            animate={{ opacity: explored ? 0 : 1 }}
            transition={{ duration: 0.5 }}
          >
            <span className="hidden md:inline">Drag to explore</span>
            <span className="md:hidden">Swipe to explore</span>
            <motion.svg
              viewBox="0 0 23 23"
              className="size-4"
              fill="none"
              animate={open && !explored ? { x: [0, 5, 0] } : { x: 0 }}
              transition={{ duration: 1.4, repeat: open && !explored ? Infinity : 0, ease: "easeInOut" }}
            >
              <path d="M12.8636 17L19 11.5L12.8636 6M19 11.5L4 11.5" stroke="currentColor" strokeWidth="1.4" />
            </motion.svg>
          </motion.span>
        </motion.div>
      </motion.div>

      <Lightbox title={project.title} images={project.images} index={lightbox} onChange={setLightbox} />
    </article>
  );
}
