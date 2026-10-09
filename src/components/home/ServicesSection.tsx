"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useId, useState } from "react";
import { services } from "@/data/content";
import { cn } from "@/lib/cn";
import { PillLink } from "@/components/ui/PillButton";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { EASE_IN_OUT_QUART, EASE_OUT_EXPO } from "@/components/motion/easing";

/** The "+" in the design is an × rotated 45°; it straightens and turns red when open. */
function ToggleIcon({ open }: { open: boolean }) {
  return (
    <motion.svg
      viewBox="0 0 14.4142 14.4142"
      aria-hidden
      className={cn("size-[13px] shrink-0 transition-colors duration-500", open ? "text-brand" : "text-ink")}
      initial={false}
      animate={{ rotate: open ? 0 : 45 }}
      transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
    >
      <path d="M0.707107 0.707142L13.7071 13.7071M13.7071 0.707107L0.707109 13.7071" stroke="currentColor" strokeWidth="2" />
    </motion.svg>
  );
}

export function ServicesSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const baseId = useId();

  return (
    <section id="services" className="container-content scroll-mt-28 pt-[clamp(5rem,8vw,6.5rem)]">
      <SectionHeading>Services &amp; Projects</SectionHeading>

      <div className="mt-[26px] grid gap-10 md:grid-cols-[minmax(0,526fr)_minmax(0,517fr)] md:gap-x-[43px]">
        {/* Fixed section image — the exact Figma crop (node 69:361), balloon and sky included. */}
        <Reveal className="relative aspect-[526/746] overflow-hidden bg-white">
          <Image
            src="/images/home/services-section.webp"
            alt="Aerial rendering of an ADD masterplan with a central tower and landscaped boulevard"
            fill
            sizes="(min-width: 768px) 526px, 100vw"
            className="object-cover"
          />
        </Reveal>

        <div>
          <Reveal>
            <p className="text-[clamp(1.125rem,1rem+0.4vw,1.5rem)] leading-[1.54]">
              Innovative Architectural Solutions Tailored To Every Project.
            </p>
          </Reveal>

          <Stagger className="mt-[clamp(1.5rem,3vw,4.25rem)]" stagger={0.07}>
            {services.map((service, i) => {
              const open = openIndex === i;
              const panelId = `${baseId}-${service.slug}`;
              return (
                <StaggerItem key={service.slug} className="border-b border-ink last:border-b-0">
                  <h3>
                    <button
                      type="button"
                      aria-expanded={open}
                      aria-controls={panelId}
                      onClick={() => setOpenIndex(open ? null : i)}
                      className="group flex w-full items-center justify-between gap-6 pr-[7px] text-left"
                    >
                      <span
                        className={cn(
                          "py-[clamp(0.5rem,0.6vw,0.75rem)] text-[clamp(1.375rem,1.1rem+0.9vw,2rem)] leading-[1.6] transition-[color,transform] duration-500 ease-out-expo",
                          open ? "text-brand" : "group-hover:translate-x-2",
                        )}
                      >
                        {service.title}
                      </span>
                      <ToggleIcon open={open} />
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        id={panelId}
                        role="region"
                        aria-label={service.title}
                        className="overflow-hidden"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.7, ease: EASE_IN_OUT_QUART }}
                      >
                        <div className="flex flex-col gap-7 pr-[7px] pb-7">
                          <p className="md:text-justify text-[clamp(1rem,0.9rem+0.35vw,1.25rem)] leading-[1.1] text-muted">
                            {service.description}
                          </p>
                          <PillLink href={service.projectsHref} className="self-end">
                            View Projects
                          </PillLink>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
