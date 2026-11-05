import type { Project } from "@/data/types";

/**
 * Filter facets for the projects feed. Add a facet here and it appears in the
 * Filter panel automatically: `get` reads the value a project is grouped by.
 */
export const FACETS = [
  { key: "type", label: "Project type", get: (p: Project) => p.type },
  { key: "year", label: "Year", get: (p: Project) => p.year, order: "desc" },
  { key: "country", label: "Country", get: (p: Project) => p.location.split(",").at(-1)?.trim() ?? "" },
] as const satisfies readonly {
  key: string;
  label: string;
  get: (p: Project) => string;
  order?: "desc";
}[];

export type FacetKey = (typeof FACETS)[number]["key"];
/** Selected values per facet: OR within a facet, AND across facets. */
export type Filters = Partial<Record<FacetKey, string[]>>;

export type FacetOption = { value: string; count: number };
export type FacetGroup = { key: FacetKey; label: string; options: FacetOption[] };

function passes(p: Project, filters: Filters, skip?: FacetKey) {
  return FACETS.every((f) => {
    if (f.key === skip) return true;
    const picked = filters[f.key];
    return !picked?.length || picked.includes(f.get(p));
  });
}

/** Free-text search over name, type and place (and client). */
export function matchesQuery(p: Project, query: string) {
  const q = query.trim().toLowerCase();
  return !q || [p.title, p.type, p.location, p.client].some((v) => v.toLowerCase().includes(q));
}

export function applyFilters(projects: Project[], filters: Filters, query: string) {
  return projects.filter((p) => matchesQuery(p, query) && passes(p, filters));
}

/**
 * Options for every facet with live counts: each facet's counts respect the
 * search and the *other* facets, so a choice never leads to an empty list.
 */
export function facetGroups(projects: Project[], filters: Filters, query: string): FacetGroup[] {
  const searched = projects.filter((p) => matchesQuery(p, query));
  return FACETS.map((f) => {
    const all = new Map<string, number>();
    for (const p of projects) {
      const v = f.get(p);
      if (v) all.set(v, 0);
    }
    for (const p of searched) {
      const v = f.get(p);
      if (v && passes(p, filters, f.key)) all.set(v, (all.get(v) ?? 0) + 1);
    }
    const options = [...all].map(([value, count]) => ({ value, count }));
    options.sort((a, b) =>
      "order" in f && f.order === "desc" ? b.value.localeCompare(a.value) : b.count - a.count || a.value.localeCompare(b.value),
    );
    return { key: f.key, label: f.label, options };
  }).filter((g) => g.options.length > 1);
}

export function activeCount(filters: Filters) {
  return Object.values(filters).reduce((n, v) => n + (v?.length ?? 0), 0);
}
