import Link from "next/link";
import { services } from "@/data/content";
import { ArrowCircle } from "@/components/ui/ArrowCircle";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";

/** 3 × 2 index of the six disciplines; each card jumps to its detailed section. */
export function ServiceOverview() {
  return (
    <Stagger className="grid border-t border-l border-ink/15 sm:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
      {services.map((service, i) => (
        <StaggerItem key={service.slug} className="border-r border-b border-ink/15">
          <Link
            href={`#${service.slug}`}
            className="group relative flex h-full flex-col gap-6 overflow-hidden p-[clamp(1.25rem,2.2vw,2.25rem)]"
          >
            <span
              aria-hidden
              className="absolute inset-0 translate-y-full bg-surface transition-transform duration-700 ease-out-expo group-hover:translate-y-0"
            />
            <div className="relative flex items-center justify-between">
              <span className="text-sm tracking-[0.2em] text-brand tabular-nums">{String(i + 1).padStart(2, "0")}</span>
              <ArrowCircle size={26} />
            </div>
            <div className="relative">
              <h3 className="text-[clamp(1.25rem,1.05rem+0.6vw,1.75rem)] leading-snug font-medium">{service.title}</h3>
              <p className="mt-3 text-[15px] leading-[1.6] text-muted">{service.summary}</p>
            </div>
          </Link>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
