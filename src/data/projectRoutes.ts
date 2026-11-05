import { categoryOrder, projects } from "./projects";
import type { Project, ProjectCategory } from "./types";

/** Top-level classifications — each one is its own page at /projects/<slug>. */
export const CATEGORIES: { slug: ProjectCategory; label: string }[] = [
  { slug: "architecture", label: "Architecture" },
  { slug: "urban", label: "Urban" },
  { slug: "interior", label: "Interior" },
];

export function isCategory(slug: string): slug is ProjectCategory {
  return CATEGORIES.some((c) => c.slug === slug);
}

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function filterProjects(category?: ProjectCategory): Project[] {
  if (!category) return projects;
  const listed = projects.filter((p) => p.category === category || p.alsoIn?.includes(category));
  // Each classification keeps its own Figma order (shared projects sit at different positions).
  const rank = (p: Project) => {
    const i = categoryOrder[category].indexOf(p.slug);
    return i === -1 ? Infinity : i;
  };
  return listed.sort((a, b) => rank(a) - rank(b));
}

export type ProjectsView =
  | { kind: "all"; list: Project[]; basePath: string }
  | { kind: "category"; category: ProjectCategory; list: Project[]; basePath: string }
  | { kind: "project"; project: Project; category: ProjectCategory; list: Project[]; basePath: string };

/**
 * Resolves the optional catch-all segments of /projects/[[...segments]]:
 *   /projects                 → every project
 *   /projects/architecture    → one classification
 *   /projects/<project-slug>  → that classification's feed, the project opened first
 */
export function resolveProjectsView(segments: string[] = []): ProjectsView | null {
  const [first, ...rest] = segments;
  if (rest.length) return null;

  if (!first) return { kind: "all", list: projects, basePath: "/projects" };

  if (isCategory(first)) {
    return { kind: "category", category: first, list: filterProjects(first), basePath: `/projects/${first}` };
  }

  const project = getProject(first);
  if (!project) return null;
  const siblings = filterProjects(project.category).filter((p) => p.slug !== project.slug);
  return {
    kind: "project",
    project,
    category: project.category,
    list: [project, ...siblings],
    basePath: `/projects/${project.category}`,
  };
}

/**
 * Every URL under /projects, for static generation and the sitemap.
 * `[]` is bare /projects — the "All Projects" view.
 */
export function allProjectPaths(): string[][] {
  const paths: string[][] = [[]];
  for (const c of CATEGORIES) paths.push([c.slug]);
  for (const p of projects) paths.push([p.slug]);
  return paths;
}
