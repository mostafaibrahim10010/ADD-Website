import { services } from "@/data/content";
import { cn } from "@/lib/cn";
import { PillLink } from "@/components/ui/PillButton";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";

function Check() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden className="mt-[5px] size-4 shrink-0 fill-none stroke-brand">
      <path d="M2.5 8.5 6.2 12 13.5 4" strokeWidth="1.6" />
    </svg>
  );
}

/**
 * One full row per service, image and copy alternating sides. Every service
 * carries the same two actions so the page reads consistently.
 */
export function ServiceList() {
  return (
    <ol className="flex flex-col gap-[clamp(4.5rem,9vw,8rem)]">
      {services.map((service, i) => {
        const flip = i % 2 === 1;
        return (
          <li
            key={service.slug}
            id={service.slug}
            className="grid scroll-mt-32 items-start gap-8 md:grid-cols-2 md:gap-x-[clamp(2rem,4.5vw,4.5rem)]"
          >
            <div className={cn("md:sticky md:top-32", flip && "md:order-2")}>
              <ParallaxImage
                src={service.image}
                alt={service.title}
                className="aspect-[526/660] w-full"
                sizes="(min-width: 768px) 526px, 100vw"
              />
            </div>

            <div className={cn("flex flex-col items-start md:pt-6", flip && "md:order-1")}>
              <Reveal y={20}>
                <span className="text-sm tracking-[0.2em] text-brand tabular-nums">
                  {String(i + 1).padStart(2, "0")} / {String(services.length).padStart(2, "0")}
                </span>
              </Reveal>
              <TextReveal
                as="h2"
                text={service.title}
                className="mt-4 text-[clamp(1.875rem,1.4rem+1.4vw,2.75rem)] leading-[1.2] font-medium"
              />
              <Reveal delay={0.1} className="mt-5">
                <p className="md:text-justify text-[clamp(1.0625rem,0.95rem+0.4vw,1.25rem)] leading-[1.6] text-ink/80">
                  {service.description}
                </p>
              </Reveal>

              <div className="mt-8 w-full border-t border-ink/15 pt-6">
                <p className="text-xs tracking-[0.18em] text-muted uppercase">What we deliver</p>
                <Stagger className="mt-4 flex flex-col gap-3" stagger={0.05}>
                  {service.deliverables.map((item) => (
                    <StaggerItem key={item} className="flex gap-3 text-[clamp(0.9375rem,0.9rem+0.15vw,1.0625rem)] leading-[1.55]">
                      <Check />
                      <span>{item}</span>
                    </StaggerItem>
                  ))}
                </Stagger>
              </div>

              <Reveal delay={0.1} className="mt-9 flex flex-wrap gap-3">
                <PillLink href={`/contact?service=${service.slug}`} variant="solid">
                  Discuss Your Project
                </PillLink>
                <PillLink href={service.projectsHref}>View Projects</PillLink>
              </Reveal>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
