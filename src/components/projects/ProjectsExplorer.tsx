"use client";

import { usePathname } from "next/navigation";
import { cubicBezier } from "motion/react";
import { useLenis } from "lenis/react";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { Project, ProjectCategory } from "@/data/types";
import { FeedItem } from "./FeedItem";
import { ProjectsBar, type BarCategory } from "./ProjectsBar";
import { activeCount, applyFilters, facetGroups, type FacetKey, type Filters } from "./filters";

type ProjectsExplorerProps = {
  projects: Project[];
  /** Every project — search always looks across all classifications. */
  allProjects: Project[];
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

export function ProjectsExplorer({
  projects,
  allProjects,
  basePath,
  categories,
  activeCategory,
  keywords,
}: ProjectsExplorerProps) {
  const pathname = usePathname();
  const lenis = useLenis();
  const feedRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");

  // The open project is whatever /projects/<slug> the URL points at…
  const pathSlug = useMemo(() => {
    const last = pathname.split("/").filter(Boolean).at(-1);
    return allProjects.some((p) => p.slug === last) ? last : undefined;
  }, [pathname, allProjects]);

  // …but a click opens it immediately, without waiting for the router to
  // report the new URL. Any real URL change (back/forward) takes over again.
  const [clicked, setClicked] = useState<{ slug: string | undefined } | null>(null);
  const [seenPath, setSeenPath] = useState(pathname);
  if (pathname !== seenPath) {
    setSeenPath(pathname);
    setClicked(null);
  }
  const openSlug = clicked ? clicked.slug : pathSlug;

  const [filters, setFilters] = useState<Filters>({});

  // Searching looks across every classification, so the bar switches to "All Projects"
  // while a query is typed; clearing it returns to this tab's own list.
  const searching = query.trim().length > 0;
  const source = searching ? allProjects : projects;
  // Search matches name, type and place; the Filter panel narrows by facet.
  const visible = useMemo(() => applyFilters(source, filters, query), [source, filters, query]);
  const groups = useMemo(() => facetGroups(source, filters, query), [source, filters, query]);
  const filterCount = activeCount(filters);

  const toggleFilter = useCallback((key: FacetKey, value: string) => {
    setFilters((f) => {
      const current = f[key] ?? [];
      const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
      return { ...f, [key]: next };
    });
  }, []);

  const clearFilters = () => {
    setQuery("");
    setFilters({});
  };

  // Plain-language summary of the active filters, for the empty state.
  const filterSummary = Object.values(filters).flat().filter(Boolean).join(", ");

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
      };
      frame.current = requestAnimationFrame(step);
    },
    [lenis],
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
        activeCategory={searching ? undefined : activeCategory}
        query={query}
        onQuery={setQuery}
        keywords={keywords}
        filter={{
          groups,
          filters,
          results: visible.length,
          activeCount: filterCount,
          onToggle: toggleFilter,
          onClear: () => setFilters({}),
        }}
      />

      <div
        ref={feedRef}
        className="flex flex-col gap-[clamp(3rem,4.17vw,5rem)] pt-[clamp(2.25rem,4.48vw,5.375rem)]"
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
            <p className="text-[13px] tracking-[0.08em] text-ink/50 uppercase">
              No projects match
              {query.trim() && ` “${query.trim()}”`}
              {filterSummary && ` · ${filterSummary}`}
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="text-[12px] tracking-[0.1em] uppercase underline underline-offset-4 hover:text-brand"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      <div aria-hidden className="h-[clamp(4rem,8vw,7rem)]" />
    </>
  );
}
