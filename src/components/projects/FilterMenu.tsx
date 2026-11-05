"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { EASE_OUT_EXPO } from "@/components/motion/easing";
import type { FacetGroup, FacetKey, Filters } from "./filters";

type FilterMenuProps = {
  groups: FacetGroup[];
  filters: Filters;
  /** Number of projects matching the current search + filters. */
  results: number;
  activeCount: number;
  onToggle: (key: FacetKey, value: string) => void;
  onClear: () => void;
  /** Shared tab typography from the bar. */
  textClass: string;
};

/**
 * "Filter" button beside the search, opening a faceted panel (type, year,
 * country…). Multiple choices per facet; counts update live.
 */
export function FilterMenu({ groups, filters, results, activeCount, onToggle, onClear, textClass }: FilterMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      // Don't let Escape also close an open project behind the panel.
      e.stopPropagation();
      setOpen(false);
      buttonRef.current?.focus();
    };
    document.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey, true);
    };
  }, [open]);

  if (!groups.length) return null;

  return (
    <div ref={rootRef} className="sm:relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={cn(
          "flex items-center gap-2 whitespace-nowrap transition-colors",
          textClass,
          activeCount || open ? "text-ink" : "text-ink/70 hover:text-ink",
        )}
      >
        <svg viewBox="0 0 16 16" aria-hidden className="size-3.5 shrink-0 fill-none stroke-current">
          <path d="M1.5 4h13M4 8h8M6.5 12h3" strokeWidth="1.4" />
        </svg>
        Filter
        {activeCount > 0 && (
          <span className="flex size-[18px] items-center justify-center rounded-full bg-brand text-[10px] leading-none font-medium text-white tabular-nums">
            {activeCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Filter projects"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
            transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
            data-lenis-prevent
            className="absolute inset-x-4 top-full z-40 mt-2 max-h-[70vh] overflow-y-auto border border-ink/10 bg-white shadow-[0_24px_60px_-24px_rgba(0,0,0,0.35)] sm:inset-x-auto sm:right-0 sm:mt-3 sm:w-[min(40rem,calc(100vw-2.5rem))]"
          >
            <div className="grid grid-cols-2 gap-x-8 gap-y-7 p-5 sm:p-7 md:grid-cols-3">
              {groups.map((g) => (
                <fieldset key={g.key} className="min-w-0">
                  <legend className="mb-3 text-[11px] tracking-[0.14em] text-meta uppercase">{g.label}</legend>
                  <ul className="space-y-0.5">
                    {g.options.map((o) => {
                      const checked = filters[g.key]?.includes(o.value) ?? false;
                      const disabled = !checked && o.count === 0;
                      return (
                        <li key={o.value}>
                          <button
                            type="button"
                            role="checkbox"
                            aria-checked={checked}
                            disabled={disabled}
                            onClick={() => onToggle(g.key, o.value)}
                            className={cn(
                              "group flex w-full items-start gap-2.5 py-1.5 text-left text-[12.5px] leading-snug transition-colors",
                              checked ? "text-ink" : "text-ink/75 hover:text-ink",
                              disabled && "cursor-default opacity-35 hover:text-ink/75",
                            )}
                          >
                            <span
                              aria-hidden
                              className={cn(
                                "mt-[2px] flex size-3.5 shrink-0 items-center justify-center border transition-colors",
                                checked ? "border-brand bg-brand" : "border-ink/30 group-hover:border-ink/60",
                              )}
                            >
                              {checked && (
                                <svg viewBox="0 0 12 12" className="size-2.5 fill-none stroke-white">
                                  <path d="M2.5 6.2 5 8.5l4.5-5" strokeWidth="1.6" />
                                </svg>
                              )}
                            </span>
                            <span className="min-w-0 flex-1">{o.value}</span>
                            <span className="text-[11px] text-meta tabular-nums">{o.count}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </fieldset>
              ))}
            </div>

            <div className="sticky bottom-0 flex items-center justify-between gap-4 border-t border-ink/10 bg-white px-5 py-4 sm:px-7">
              <button
                type="button"
                onClick={onClear}
                disabled={!activeCount}
                className="text-[11px] tracking-[0.12em] uppercase underline-offset-4 transition-colors hover:text-brand hover:underline disabled:opacity-35 disabled:hover:text-ink disabled:hover:no-underline"
              >
                Clear all
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full bg-ink px-5 py-2.5 text-[11px] tracking-[0.12em] text-white uppercase transition-colors hover:bg-brand"
              >
                Show {results} {results === 1 ? "project" : "projects"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
