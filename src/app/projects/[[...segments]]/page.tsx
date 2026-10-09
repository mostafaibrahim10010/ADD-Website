import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CATEGORIES, allProjectPaths, resolveProjectsView } from "@/data/projectRoutes";
import { ProjectsExplorer } from "@/components/projects/ProjectsExplorer";

type Props = PageProps<"/projects/[[...segments]]">;

export function generateStaticParams() {
  return allProjectPaths().map((segments) => ({ segments }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { segments } = await params;
  const view = resolveProjectsView(segments);
  // Resolved before the page streams, so unknown URLs get a real 404 status.
  if (!view) notFound();
  const canonical = segments?.length ? `/projects/${segments.join("/")}` : "/projects";

  if (view.kind === "project") {
    const p = view.project;
    return {
      title: p.title,
      description: `${p.title} — ${p.location}, ${p.year}. ${p.description.slice(0, 150).trim()}…`,
      alternates: { canonical },
      openGraph: { images: [{ url: p.images[0].src }] },
    };
  }
  if (view.kind === "category") {
    const label = CATEGORIES.find((c) => c.slug === view.category)!.label;
    return {
      title: `${label} Projects`,
      description: `${label} projects by ADD Architects.`,
      alternates: { canonical },
    };
  }
  return {
    title: "Projects",
    description:
      "Architecture, urban and interior projects by ADD Architects across Egypt, Saudi Arabia, Iraq and beyond.",
    alternates: { canonical },
  };
}

// Words the search box types out — real places and themes from the portfolio.
const KEYWORDS = ["RIYADH", "ALEXANDRIA", "VILLA", "WATERFRONT", "COMPETITION", "CAIRO", "MUSEUM", "BASRA"];

export default function ProjectsPage({ params }: Props) {
  // URL data is read inside Suspense so client navigations between
  // classifications stay instant (Cache Components requirement).
  return (
    <Suspense fallback={<div className="min-h-dvh" />}>
      <ProjectsContent params={params} />
    </Suspense>
  );
}

async function ProjectsContent({ params }: Pick<Props, "params">) {
  const { segments } = await params;
  const view = resolveProjectsView(segments);
  if (!view) notFound();

  const activeCategory = view.kind === "all" ? undefined : view.category;
  const heading =
    view.kind === "project"
      ? view.project.title
      : activeCategory
        ? `${CATEGORIES.find((c) => c.slug === activeCategory)!.label} projects`
        : "Projects";

  return (
    <div className="pt-[clamp(6.25rem,7.92vw,9.5rem)]">
      <h1 className="sr-only">{heading}</h1>
      <ProjectsExplorer
        // Remount per list so open state and search reset between classifications.
        key={view.basePath}
        projects={view.list}
        basePath={view.basePath}
        categories={CATEGORIES}
        activeCategory={activeCategory}
        keywords={KEYWORDS}
      />
    </div>
  );
}
