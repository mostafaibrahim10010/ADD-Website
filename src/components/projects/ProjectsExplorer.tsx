"use client";

import { usePathname } from "next/navigation";
import {
  cubicBezier,
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { useLenis } from "lenis/react";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { Project, ProjectCategory } from "@/data/types";
import { FeedItem } from "./FeedItem";
import { ProjectsBar, type BarCategory } from "./ProjectsBar";

type ProjectsExplorerProps = {
  projects: Project[];
  /** URL of the list this feed represents; closing a project returns here. */
  basePath: string;
  categories: BarCategory[];
  activeCategory?: ProjectCategory;
  keywords: string[];
};

/** big.dk's resize timing — the scroll that follows an opened project uses the same curve. */
const RESIZE_MS = 780;
const resizeEase = cubicBezier(0.45, 0, 0.55, 1);
/** The bar sticks at `top-24` (96px), under the compact header. */
const STICKY_TOP = 96;
/** Space between the sticky bar and the top of an opened project. */
const OPEN_GAP = 32;

/**
 * Feed scale while scrolling: the faster you scroll, the further the list
 * zooms out (down to ~74%), springing back when you stop — big.dk's signature.
 * `locked` pins it at 100% while the page scrolls itself to an opened project.
 */
function useVelocityZoom(ref: React.RefObject<HTMLDivElement | null>, locked: React.RefObject<boolean>) {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const target = useTransform(velocity, (v) =>
    reduce || locked.current ? 1 : 1 - Math.min(Math.abs(v) / 4200, 0.26),
  );
  const scale = useSpring(target, { stiffness: 160, damping: 28, mass: 0.6 });
  // Zoom around the middle of the viewport, wherever that falls inside the feed.
  const originY = useTransform(scrollY, (y) => {
    const el = ref.current;
    if (!el) return 0;
    const top = el.getBoundingClientRect().top + y;
    return y + window.innerHeight / 2 - top;
  });
  const transformOrigin = useMotionTemplate`50% ${originY}px`;
  return { scale, transformOrigin };
}

export function ProjectsExplorer({
  projects,
  basePath,
  categories,
  activeCategory,
  keywords,
}: ProjectsExplorerProps) {
  const pathname = usePathname();
  const lenis = useLenis();
  const feedRef = useRef<HTMLDivElement>(null);
  const zoomLocked = useRef(false);
  const [query, setQuery] = useState("");
  const { scale, transformOrigin } = useVelocityZoom(feedRef, zoomLocked);

  // The open project is whatever /projects/<slug> the URL points at…
  const pathSlug = useMemo(() => {
    const last = pathname.split("/").filter(Boolean).at(-1);
    return projects.some((p) => p.slug === last) ? last : undefined;
  }, [pathname, projects]);

  // …but a click opens it immediately, without waiting for the router to
  // report the new URL. Any real URL change (back/forward) takes over again.
  const [clicked, setClicked] = useState<{ slug: string | undefined } | null>(null);
  const [seenPath, setSeenPath] = useState(pathname);
  if (pathname !== seenPath) {
    setSeenPath(pathname);
    setClicked(null);
  }
  const openSlug = clicked ? clicked.slug : pathSlug;

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return projects;
    return projects.filter((p) =>
      [p.title, p.location, p.client, p.status, p.category, p.year].some((v) => v.toLowerCase().includes(q)),
    );
  }, [projects, query]);

  const barRef = useRef<HTMLDivElement>(null);
  const pendingScroll = useRef<string | null>(null);
  const frame = useRef(0);

  /**
   * Glide an opened project to just under the sticky bar, frame by frame, on
   * the same 0.78s curve as the image resize. Each frame re-reads the item's
   * real position, so a project collapsing above it can't knock it off course.
   */
  const guideTo = useCallback(
    (slug: string) => {
      const el = feedRef.current?.querySelector<HTMLElement>(`#${CSS.escape(slug)}`);
      if (!el) return;
      cancelAnimationFrame(frame.current);
      zoomLocked.current = true;
      scale.jump(1);

      // Where the bar sits once stuck (it may not be stuck yet when the page is at the top).
      const targetTop = STICKY_TOP + (barRef.current?.offsetHeight ?? 50) + OPEN_GAP;
      const startTop = el.getBoundingClientRect().top;
      const t0 = performance.now();

      const step = (now: number) => {
        const t = Math.min(1, (now - t0) / RESIZE_MS);
        const desired = startTop + (targetTop - startTop) * resizeEase(t);
        const y = window.scrollY + (el.getBoundingClientRect().top - desired);
        if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
        else window.scrollTo(0, y);
        if (t < 1) frame.current = requestAnimationFrame(step);
        else zoomLocked.current = false;
      };
      frame.current = requestAnimationFrame(step);
    },
    [lenis, scale],
  );

  // Start the glide in the same frame the resize transition starts.
  useLayoutEffect(() => {
    if (openSlug && pendingScroll.current === openSlug) {
      pendingScroll.current = null;
      guideTo(openSlug);
    }
  }, [openSlug, guideTo]);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  const toggle = useCallback(
    (slug: string) => {
      if (slug === openSlug) {
        setClicked({ slug: undefined });
        window.history.pushState(null, "", basePath);
        return;
      }
      pendingScroll.current = slug;
      setClicked({ slug });
      window.history.pushState(null, "", `/projects/${slug}`);
    },
    [openSlug, basePath],
  );

  // Escape closes the open project.
  useEffect(() => {
    if (!openSlug) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || document.querySelector('[role="dialog"]')) return;
      setClicked({ slug: undefined });
      window.history.pushState(null, "", basePath);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openSlug, basePath]);

  return (
    <>
      <ProjectsBar
        barRef={barRef}
        categories={categories}
        activeCategory={activeCategory}
        query={query}
        onQuery={setQuery}
        keywords={keywords}
      />

      <motion.div
        ref={feedRef}
        className="flex flex-col gap-[clamp(3rem,4.17vw,5rem)] pt-[clamp(2.25rem,4.48vw,5.375rem)] will-change-transform"
        style={{ scale, transformOrigin }}
      >
        {visible.map((project, i) => (
          <FeedItem
            key={project.slug}
            project={project}
            open={project.slug === openSlug}
            priority={i < 2}
            onToggle={toggle}
          />
        ))}

        {visible.length === 0 && (
          <div className="container-content flex flex-col items-center gap-4 py-24 text-center">
            <p className="text-[13px] tracking-[0.08em] text-ink/50 uppercase">No projects match “{query}”</p>
            <button
              type="button"
              onClick={() => setQuery("")}
              className="text-[12px] tracking-[0.1em] uppercase underline underline-offset-4 hover:text-brand"
            >
              Clear search
            </button>
          </div>
        )}
      </motion.div>

      <div className="flex justify-center pt-[clamp(3rem,6vw,5rem)] pb-[clamp(3rem,6vw,5rem)]">
        <button
          type="button"
          onClick={() => (lenis ? lenis.scrollTo(0, { duration: 1.4 }) : window.scrollTo({ top: 0, behavior: "smooth" }))}
          className="px-4 py-3 text-[12px] tracking-[0.12em] uppercase transition-colors hover:text-brand"
        >
          Back to top
        </button>
      </div>
    </>
  );
}
