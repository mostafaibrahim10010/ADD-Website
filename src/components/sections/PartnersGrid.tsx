import Image from "next/image";
import { partnerLogos } from "@/data/content";
import { cn } from "@/lib/cn";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";

/**
 * Full-colour partner & client logos on light tiles — 3 / 4 / 5 per row, with
 * a short last row aligned left, on the same columns as the rows above.
 */
export function PartnersGrid({ className }: { className?: string }) {
  return (
    <Stagger
      stagger={0.03}
      className={cn(
        "flex flex-wrap justify-start gap-(--gap) [--cols:3] [--gap:clamp(0.5rem,0.9vw,1rem)] sm:[--cols:4] md:[--cols:5]",
        className,
      )}
    >
      {partnerLogos.map(({ name, src }) => (
        <StaggerItem
          key={src}
          className="basis-[calc((100%_-_(var(--cols)_-_1)_*_var(--gap))_/_var(--cols))]"
        >
          <div className="group relative aspect-[205/112] overflow-hidden bg-surface transition-[background-color,box-shadow] duration-500 hover:bg-white hover:shadow-[0_10px_30px_-12px_rgba(0,0,0,0.25)]">
            <Image
              src={src}
              alt={name}
              fill
              sizes="(min-width: 768px) 205px, 30vw"
              className="object-contain transition-transform duration-700 ease-out-expo group-hover:scale-[1.07]"
            />
          </div>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
