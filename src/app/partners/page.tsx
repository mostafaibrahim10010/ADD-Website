import type { Metadata } from "next";
import { awards, values } from "@/data/content";
import { pickProjects } from "@/data/projects";
import { PageHeader } from "@/components/ui/PageHeader";
import { PillLink } from "@/components/ui/PillButton";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FeatureGrid } from "@/components/sections/FeatureGrid";
import { PartnersGrid } from "@/components/sections/PartnersGrid";
import { ProjectCard } from "@/components/sections/ProjectCard";
import { StatsGrid } from "@/components/sections/StatsGrid";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";

export const metadata: Metadata = {
  title: "Partners & Clients",
  description:
    "Public institutions, developers and international organisations that ADD Architects has partnered with across Egypt and the region.",
  alternates: { canonical: "/partners" },
};

// Projects with a named client in the portfolio.
const collaborations = pickProjects(
  "al-olaya",
  "yamama-bussniss-hub",
  "dar-yamama-residentail-compound",
  "nile-gate",
  "al-ahram",
  "gleem-flat",
);

const section = "container-content scroll-mt-28 pt-[clamp(5rem,9vw,8rem)]";

export default function PartnersPage() {
  return (
    <>
      <PageHeader
        crumb="Partners & Clients"
        title="Trusted By Institutions, Developers And Communities"
        lead="Our work is built on long-standing relationships with public authorities, developers, contractors and international organisations — partners who share our commitment to thoughtful, lasting architecture."
      >
        <StatsGrid className="mt-[clamp(2.5rem,4vw,3.5rem)]" />
      </PageHeader>

      <section aria-label="Key partners and clients" className={section}>
        <SectionHeading>Key Partners &amp; Clients</SectionHeading>
        <PartnersGrid className="mt-[clamp(1.5rem,2.5vw,2.5rem)]" />
      </section>

      <section aria-label="Why partners choose ADD" className={section}>
        <SectionHeading>Why Partners Choose ADD</SectionHeading>
        <TextReveal
          text="One Studio, From The First Idea To The Final Detail"
          className="mt-[21px] max-w-[900px] text-display-sm font-medium"
        />
        <FeatureGrid items={values} columns={4} className="mt-[clamp(2rem,3vw,3rem)]" />
      </section>

      <section aria-label="Selected collaborations" className={section}>
        <SectionHeading>Selected Collaborations</SectionHeading>
        <Stagger className="mt-[clamp(1.5rem,3vw,2.5rem)] grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {collaborations.map((project) => (
            <StaggerItem key={project.slug}>
              <ProjectCard project={project} eyebrow={`Client · ${project.client}`} />
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section aria-label="Awards and recognition" className={`${section} pb-[clamp(4rem,7vw,7.5rem)]`}>
        <SectionHeading>Awards &amp; Recognition</SectionHeading>
        <div className="mt-[clamp(1.5rem,3vw,2.5rem)] grid gap-[clamp(2rem,4vw,4rem)] md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <ParallaxImage
            src="/images/about/about-04.webp"
            alt="Receiving the AIA Middle East award in Jordan, 2025"
            className="aspect-[4/5] w-full"
            objectPosition="50% 30%"
          />
          <div className="flex flex-col">
            <Stagger className="flex flex-col" stagger={0.1}>
              {awards.map((award, i) => (
                <StaggerItem key={award.title} className="border-b border-ink/15 py-6 first:pt-0">
                  <p className="text-sm tracking-[0.2em] text-brand tabular-nums">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="mt-2 text-[clamp(1.125rem,1rem+0.5vw,1.5rem)] leading-snug font-semibold">{award.title}</h3>
                  <p className="mt-2 text-[15px] leading-[1.65] text-muted">{award.description}</p>
                </StaggerItem>
              ))}
            </Stagger>
            <Reveal className="mt-auto flex flex-wrap gap-3 pt-8">
              <PillLink href="/contact" variant="solid">
                Partner With Us
              </PillLink>
              <PillLink href="/about">About ADD</PillLink>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
