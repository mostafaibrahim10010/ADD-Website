import Image from "next/image";
import { partnerLogos } from "@/data/content";
import { cn } from "@/lib/cn";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";

/** 5 × 5 grid of partner & client logos on light tiles. */
export function PartnersGrid({ className }: { className?: string }) {
  return (
    <Stagger
      stagger={0.03}
      className={cn(
        "grid grid-cols-3 gap-[clamp(0.5rem,0.9vw,1rem)] sm:grid-cols-4 md:grid-cols-5",
        className,
      )}
    >
      {partnerLogos.map((src, i) => (
        <StaggerItem key={src}>
          <div className="group relative aspect-[205/112] overflow-hidden bg-surface transition-[background-color,box-shadow] duration-500 hover:bg-white hover:shadow-[0_10px_30px_-12px_rgba(0,0,0,0.25)]">
            <Image
              src={src}
              alt={`Partner logo ${i + 1}`}
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
