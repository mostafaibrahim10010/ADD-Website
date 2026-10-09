import type { Metadata } from "next";
import { process, sectors } from "@/data/content";
import { pickProjects } from "@/data/projects";
import { PageHeader } from "@/components/ui/PageHeader";
import { PillLink } from "@/components/ui/PillButton";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceOverview } from "@/components/services/ServiceOverview";
import { ServiceList } from "@/components/services/ServiceList";
import { FeatureGrid } from "@/components/sections/FeatureGrid";
import { ProjectCard } from "@/components/sections/ProjectCard";
import { StepList } from "@/components/sections/StepList";
import { ExpertiseSection } from "@/components/home/ExpertiseSection";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Architecture design, urban design, interior design, construction supervision, BIM and project management services by ADD Architects.",
  alternates: { canonical: "/services" },
};

const featured = pickProjects("the-dakeer-island", "siwa-residential-compound", "keheilan-headquarters");

const section = "container-content scroll-mt-28 pt-[clamp(5rem,9vw,8rem)]";

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        crumb="Services"
        title="Innovative Architectural Solutions Tailored To Every Project."
        lead="From the first sketch to the final handover, ADD brings design, engineering and delivery under one roof — six disciplines working as a single, coordinated practice."
      >
        <Reveal delay={0.3} className="mt-9 flex flex-wrap gap-3">
          <PillLink href="/contact" variant="solid">
            Start a Project
          </PillLink>
          <PillLink href="/projects">View Projects</PillLink>
        </Reveal>
      </PageHeader>

      {/* Overview */}
      <section aria-label="Our disciplines" className={section}>
        <SectionHeading>Our Disciplines</SectionHeading>
        <div className="mt-[clamp(1.5rem,3vw,2.5rem)]">
          <ServiceOverview />
        </div>
      </section>

      {/* Detail */}
      <section aria-label="Services in detail" className={section}>
        <SectionHeading>Services &amp; Projects</SectionHeading>
        <div className="mt-[clamp(2.5rem,4vw,4rem)]">
          <ServiceList />
        </div>
      </section>

      {/* Process */}
      <section aria-label="How we work" className={section}>
        <SectionHeading>How We Work</SectionHeading>
        <div className="mt-[21px] grid gap-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:items-end">
          <TextReveal
            text="A Clear Process From Brief To Handover"
            className="text-display-sm font-medium"
            as="h2"
          />
          <Reveal delay={0.1}>
            <p className="text-[clamp(1rem,0.95rem+0.3vw,1.1875rem)] leading-[1.6] text-ink/75">
              Every commission follows the same disciplined path, so you always know where your project stands
              and what comes next.
            </p>
          </Reveal>
        </div>
        <div className="mt-[clamp(2.5rem,4vw,4rem)]">
          <StepList steps={process} />
        </div>
      </section>

      {/* Sectors */}
      <section aria-label="Sectors we serve" className={section}>
        <SectionHeading>Sectors We Serve</SectionHeading>
        <FeatureGrid items={sectors} className="mt-[clamp(1.5rem,3vw,2.5rem)]" />
      </section>

      {/* Selected work */}
      <section aria-label="Selected work" className={section}>
        <SectionHeading>Selected Work</SectionHeading>
        <Stagger className="mt-[clamp(1.5rem,3vw,2.5rem)] grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((project) => (
            <StaggerItem key={project.slug}>
              <ProjectCard project={project} />
            </StaggerItem>
          ))}
        </Stagger>
        <Reveal className="mt-10 flex justify-end">
          <PillLink href="/projects">View All Projects</PillLink>
        </Reveal>
      </section>

      <div className="pb-[clamp(4rem,7vw,7.5rem)]">
        <ExpertiseSection />
      </div>
    </>
  );
}
