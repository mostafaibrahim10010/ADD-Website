"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type RefObject } from "react";
import type { ProjectCategory } from "@/data/types";
import { cn } from "@/lib/cn";

export type BarCategory = { slug: ProjectCategory; label: string };

type ProjectsBarProps = {
  barRef?: RefObject<HTMLDivElement | null>;
  categories: BarCategory[];
  activeCategory?: ProjectCategory;
  query: string;
  onQuery: (q: string) => void;
  /** Words the search placeholder types out in turn. */
  keywords: string[];
};

/** Figma tab type: uppercase 17px on a 31px line (scaled below 1920px). */
const tabText = "text-[clamp(13px,0.89vw,17px)] leading-[31px] uppercase";

/** Search field whose placeholder types and erases keywords, like big.dk. */
function TypewriterSearch({ query, onQuery, keywords }: Pick<ProjectsBarProps, "query" | "onQuery" | "keywords">) {
  const [text, setText] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (focused || query) return;
    let word = 0;
    let char = 0;
    let deleting = false;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const current = keywords[word % keywords.length];
      if (!deleting) {
        char += 1;
        setText(current.slice(0, char));
        if (char === current.length) {
          deleting = true;
          timer = setTimeout(tick, 1600);
          return;
        }
        timer = setTimeout(tick, 85);
      } else {
        char -= 1;
        setText(current.slice(0, char));
        if (char === 0) {
          deleting = false;
          word += 1;
          timer = setTimeout(tick, 350);
          return;
        }
        timer = setTimeout(tick, 40);
      }
    };
    timer = setTimeout(tick, 600);
    return () => clearTimeout(timer);
  }, [focused, query, keywords]);

  return (
    <label className={cn("flex cursor-text items-center gap-2 text-ink/45", tabText)}>
      <svg viewBox="0 0 16 16" aria-hidden className="size-3.5 shrink-0 fill-none stroke-ink">
        <circle cx="9.5" cy="6.5" r="4.75" strokeWidth="1.4" />
        <path d="M6 10 1.5 14.5" strokeWidth="1.4" />
      </svg>
      <span className="relative">
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={(e) => {
            if (e.key !== "Escape") return;
            onQuery("");
            inputRef.current?.blur();
          }}
          className="w-[10rem] bg-transparent text-ink uppercase outline-none placeholder:text-transparent [&::-webkit-search-cancel-button]:hidden"
          placeholder="Search"
          aria-label="Search projects"
        />
        {!query && (
          <span aria-hidden className="pointer-events-none absolute inset-y-0 left-0 flex items-center">
            {focused ? "" : text}
            {!focused && <span className="ml-px inline-block h-3 w-px animate-pulse bg-ink/40" />}
          </span>
        )}
      </span>
    </label>
  );
}

/**
 * Sticky classification tabs (Figma "sections" frame): ARCHITECTURE / URBAN /
 * INTERIOR left-aligned on a 1px rule, the active one underlined 2px. Each tab
 * is its own page. Search sits on the right.
 */
export function ProjectsBar({ barRef, categories, activeCategory, query, onQuery, keywords }: ProjectsBarProps) {
  return (
    <div ref={barRef} className="sticky top-24 z-30 bg-white/92 pt-2.5 backdrop-blur-md">
      <div className="container-wide">
        <div className="flex flex-col-reverse gap-2 border-b border-ink sm:flex-row sm:items-end sm:justify-between sm:gap-6">
          <nav aria-label="Project classifications" className="no-scrollbar -mb-px overflow-x-auto">
            <ul className="flex gap-[clamp(1.25rem,1.72vw,2.0625rem)]">
              {categories.map((c) => {
                const active = c.slug === activeCategory;
                return (
                  <li key={c.slug} className="relative">
                    <Link
                      href={`/projects/${c.slug}`}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "block pb-[5px] whitespace-nowrap transition-colors duration-300",
                        tabText,
                        active ? "font-medium text-ink" : "text-ink/70 hover:text-ink",
                      )}
                    >
                      {c.label}
                    </Link>
                    <span
                      aria-hidden
                      className={cn(
                        "absolute inset-x-0 bottom-0 h-0.5 origin-left bg-ink transition-transform duration-500 ease-out-expo",
                        active ? "scale-x-100" : "scale-x-0",
                      )}
                    />
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="pb-[5px]">
            <TypewriterSearch query={query} onQuery={onQuery} keywords={keywords} />
          </div>
        </div>
      </div>
    </div>
  );
}
