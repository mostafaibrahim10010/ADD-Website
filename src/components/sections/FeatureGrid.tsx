import type { Step } from "@/data/types";
import { cn } from "@/lib/cn";
import { ArchIcon } from "@/components/ui/SectionHeading";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";

type FeatureGridProps = {
  items: Step[];
  columns?: 2 | 3 | 4;
  className?: string;
};

const COLS = { 2: "md:grid-cols-2", 3: "md:grid-cols-2 lg:grid-cols-3", 4: "md:grid-cols-2 lg:grid-cols-4" };

/** Light cards with the arch bullet; the bullet turns brand red on hover. */
export function FeatureGrid({ items, columns = 3, className }: FeatureGridProps) {
  return (
    <Stagger className={cn("grid gap-[clamp(0.75rem,1.4vw,1.25rem)]", COLS[columns], className)} stagger={0.07}>
      {items.map((item) => (
        <StaggerItem key={item.title} className="h-full">
          <div className="group flex h-full flex-col bg-surface p-[clamp(1.25rem,2vw,2rem)] transition-[background-color,box-shadow] duration-500 hover:bg-white hover:shadow-[0_18px_40px_-18px_rgba(0,0,0,0.3)]">
            <span className="text-ink transition-colors duration-500 group-hover:text-brand">
              <ArchIcon />
            </span>
            <h3 className="mt-6 text-[clamp(1.125rem,1rem+0.4vw,1.375rem)] leading-snug font-medium">{item.title}</h3>
            <p className="mt-3 text-[15px] leading-[1.65] text-muted">{item.description}</p>
          </div>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
