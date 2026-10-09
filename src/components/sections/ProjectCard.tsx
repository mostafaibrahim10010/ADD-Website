import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/data/types";
import { ArrowCircle } from "@/components/ui/ArrowCircle";

const CATEGORY_LABEL: Record<Project["category"], string> = {
  architecture: "Architecture",
  urban: "Urban",
  interior: "Interior",
};

type ProjectCardProps = {
  project: Project;
  /** Optional line shown above the title, e.g. the client name. */
  eyebrow?: string;
};

/** Image-led card that links to the project's row on the Projects page. */
export function ProjectCard({ project, eyebrow }: ProjectCardProps) {
  const cover = project.images[0];
  return (
    <Link href={`/projects/${project.slug}`} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden bg-surface">
        <Image
          src={cover.src}
          alt={`${project.title}, ${project.location}`}
          fill
          sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-[1.2s] ease-out-expo group-hover:scale-[1.06]"
        />
        <span className="absolute top-3 left-3 bg-white/90 px-2.5 py-1 text-[11px] tracking-[0.14em] uppercase backdrop-blur">
          {CATEGORY_LABEL[project.category]}
        </span>
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          {eyebrow && <p className="text-xs tracking-[0.14em] text-muted uppercase">{eyebrow}</p>}
          <h3 className="mt-1 text-lg leading-snug font-semibold transition-colors duration-500 group-hover:text-brand">
            {project.title}
          </h3>
          <p className="mt-0.5 text-sm text-muted">
            {project.location} · {project.year} · {project.status}
          </p>
        </div>
        <span className="mt-1.5 shrink-0">
          <ArrowCircle size={28} />
        </span>
      </div>
    </Link>
  );
}
