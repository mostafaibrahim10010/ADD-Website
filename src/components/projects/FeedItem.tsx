"use client";

import Image from "next/image";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { Fragment, useEffect, useRef, useState, type CSSProperties, type MouseEvent, type PointerEvent } from "react";
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
 *
 * Outside (collapsed), every project's lead image sits in the same standard
 * 1033 × 522 frame (cover), so the list reads as one coherent column.
 * Inside (open), no image is cropped — the lead included: each frame takes its
 * image's own aspect ratio and the row height drives the width.
 * `--r` is the lead image's width / height, `--rc` the shared collapsed ratio.
 */
const ROW_VARS = {
  "--h": "clamp(240px, 27.19cqw, 522px)",
  "--hc": "calc(clamp(260px, 30cqw, 560px) * 522 / 1033)", // collapsed (big.dk-style) lead height
  "--rc": 1033 / 522,
  "--wl1": "calc(var(--hc) * var(--rc))", // collapsed lead width (same for every project)
  "--wl2": "calc(var(--h) * var(--r))", // open lead width (native ratio)
  "--wm": "min(90cqw, calc(110cqw * var(--r)))", // mobile open lead width (native ratio)
  "--meta": "clamp(170px, 13.18cqw, 253px)",
  "--gap": "clamp(20px, 2.4cqw, 46px)",
  "--dgap": "clamp(22px, 2.86cqw, 55px)",
  "--igap": "clamp(14px, 2.08cqw, 40px)",
  "--dw": "clamp(230px, 19.11cqw, 367px)",
  "--gutter": "max(20px, calc((100cqw - 1570px) / 2))",
  "--ml1": "calc(50cqw - var(--wl1) / 2)",
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

/** Optional 18px heading, then paragraphs split on blank lines (Figma: one empty line between them). */
function TextBody({ title, text }: { title?: string; text: string }) {
  return (
    <>
      {title && (
        <h3 className="mb-[1.5em] text-left text-[clamp(16px,0.9375vw,18px)] leading-snug text-ink">{title}</h3>
      )}
      <div className="space-y-[1.5em]">
        {text.split(/\n\s*\n/).map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
    </>
  );
}

const TEXT_COLUMN =
  "w-[var(--dw)] shrink-0 overflow-y-auto md:text-justify text-[clamp(13px,0.73vw,14px)] leading-[1.5] tracking-[0.28px] text-ink-soft md:h-[var(--h)]";

/**
 * One project in the feed. Collapsed (big.dk): title, location and year beside
 * a centred image. Open (Figma row): the image grows to 1033 × 522, the meta
 * column gains project type / client / status / size / share, and the description plus the
 * remaining images slide in as a draggable strip.
 */
export function FeedItem({ project, open, priority, onToggle }: FeedItemProps) {
  const [first, ...rest] = project.images;
  const href = `/projects/${project.slug}`;
  const rowVars = { ...ROW_VARS, "--r": first.width / first.height } as CSSProperties;
  const fields = [
    { label: "PROJECT TYPE", value: project.type.trim() },
    { label: "CLIENT", value: project.client.trim() },
    { label: "STATUS", value: project.status.trim() },
    { label: "SIZE M2/FT2", value: project.size.trim() },
  ].filter((f) => f.value);

  const rowRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const [metaH, setMetaH] = useState(0);

  // Track the meta column's height so the open row is always tall enough for it.
  useEffect(() => {
    const el = metaRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setMetaH(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
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
    <article id={project.slug} aria-labelledby={`${project.slug}-title`} className="@container" style={rowVars}>
      <motion.div
        ref={rowRef}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.05 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
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
            className={cn("flex w-max items-start pr-[5cqw]", open ? "md:min-h-[max(360px,var(--mh,0px))]" : "md:min-h-0")}
            style={{ transition: `min-height ${RESIZE}`, "--mh": `${metaH}px` } as CSSProperties}
          >
            {/* Lead image — width and offset animate between the two states */}
            <div
              className={cn(
                "relative shrink-0",
                "ml-[5cqw]", // mobile: meta stacks above
                open ? "w-[var(--wm)] md:ml-[var(--ml2)] md:w-[var(--wl2)]" : "w-[90cqw] md:ml-[var(--ml1)] md:w-[var(--wl1)]",
              )}
              style={resize}
            >
              {/*
               * Meta column: hangs left of the image and spans at least its full height (Figma).
               * When long values wrap it grows past the image, and the row grows with it
               * (via --mh) so the share links are never clipped.
               */}
              <div
                ref={metaRef}
                className={cn(
                  "mb-4 flex flex-col gap-5 md:absolute md:top-0 md:right-full md:mr-[var(--gap)] md:mb-0 md:min-h-full md:w-[var(--meta)] md:justify-between md:gap-[clamp(14px,1.04vw,20px)] md:text-right",
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
                  {project.location && (
                    <p className="mt-1 text-[clamp(14px,0.8333vw,16px)] leading-normal">{project.location}</p>
                  )}
                  {project.year && <p className="text-[clamp(14px,0.8333vw,16px)] leading-normal">{project.year}</p>}
                </a>

                <AnimatePresence initial={false}>
                  {open && fields.length > 0 && (
                    <motion.dl
                      key="fields"
                      className="grid grid-cols-2 gap-x-6 gap-y-3 md:mt-[calc(var(--h)*18/522)] md:flex md:flex-col md:gap-y-[clamp(7px,0.57vw,11px)]"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.35 } }}
                      exit={{ opacity: 0, transition: { duration: 0.15 } }}
                    >
                      {fields.map((f) => (
                        <Field key={f.label} label={f.label} value={f.value} />
                      ))}
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
                className={cn(
                  "relative block overflow-hidden bg-surface md:aspect-auto",
                  open ? "aspect-(--r) md:h-[var(--h)]" : "aspect-(--rc) md:h-[var(--hc)]",
                )}
                style={{ transition: `height ${RESIZE}` }}
                aria-label={open ? `Enlarge ${project.title} image 1` : `Open ${project.title}`}
              >
                <Image
                  src={first.src}
                  alt={[project.title, project.location].filter(Boolean).join(", ")}
                  fill
                  draggable={false}
                  priority={priority}
                  sizes="(min-width: 768px) 1100px, 90vw"
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
                  {project.description && (
                    <motion.div
                      className={cn("mr-[calc(var(--dgap)_-_var(--igap))]", TEXT_COLUMN)}
                      initial={{ opacity: 0, x: 60 }}
                      animate={{ opacity: 1, x: 0, transition: { duration: 1, ease: EASE_OUT_EXPO, delay: 0.45 } }}
                      data-lenis-prevent
                    >
                      <TextBody title={project.descriptionTitle} text={project.description} />
                    </motion.div>
                  )}
                  {rest.map((img, i) => (
                    <Fragment key={img.src}>
                    {project.textBlocks
                      ?.filter((b) => b.afterImage === i + 1)
                      .map((b) => (
                        <motion.div
                          key={b.title ?? b.text.slice(0, 24)}
                          className={cn("mx-[calc(var(--dgap)_-_var(--igap))]", TEXT_COLUMN)}
                          initial={{ opacity: 0, x: 80 }}
                          animate={{
                            opacity: 1,
                            x: 0,
                            transition: { duration: 1.1, ease: EASE_OUT_EXPO, delay: 0.5 + Math.min(i, 5) * 0.07 },
                          }}
                          data-lenis-prevent
                        >
                          <TextBody title={b.title} text={b.text} />
                        </motion.div>
                      ))}
                    <motion.button
                      type="button"
                      onClick={() => drag.current.moved <= 6 && setLightbox(i + 1)}
                      className="relative h-[60cqw] shrink-0 overflow-hidden bg-surface md:h-[var(--h)]"
                      style={{ aspectRatio: `${img.width} / ${img.height}` }}
                      initial={{ opacity: 0, x: 80 }}
                      animate={{
                        opacity: 1,
                        x: 0,
                        transition: { duration: 1.1, ease: EASE_OUT_EXPO, delay: 0.5 + Math.min(i, 5) * 0.07 },
                      }}
                      aria-label={`Enlarge ${project.title} image ${i + 2} of ${project.images.length}`}
                    >
                      <Image src={img.src} alt="" fill draggable={false} sizes="(min-width: 768px) 1100px, 80vw" className="object-cover" />
                    </motion.button>
                    </Fragment>
                  ))}
                  {/* Text placed after the last image */}
                  {project.textBlocks
                    ?.filter((b) => b.afterImage >= project.images.length)
                    .map((b) => (
                      <div key={b.title ?? b.text.slice(0, 24)} className={cn("ml-[calc(var(--dgap)_-_var(--igap))]", TEXT_COLUMN)} data-lenis-prevent>
                        <TextBody title={b.title} text={b.text} />
                      </div>
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
