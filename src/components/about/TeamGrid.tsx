import Image from "next/image";
import { team } from "@/data/content";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";

export function TeamGrid() {
  return (
    <Stagger
      stagger={0.06}
      className="grid grid-cols-2 gap-x-[clamp(0.75rem,1.6vw,1.625rem)] gap-y-[25px] md:grid-cols-3 lg:grid-cols-4"
    >
      {team.map((member) => (
        <StaggerItem key={member.name}>
          <article className="group flex h-full flex-col items-center gap-[18px] overflow-hidden rounded-[8px] bg-white pb-7 shadow-[0_4px_5.45px_rgba(0,0,0,0.25)] transition-[transform,box-shadow] duration-500 ease-out-expo hover:-translate-y-1.5 hover:shadow-[0_18px_30px_-10px_rgba(0,0,0,0.3)]">
            <div className="relative aspect-[251/230] w-full overflow-hidden bg-surface">
              <Image
                src="/images/about/team-placeholder.webp"
                alt=""
                fill
                sizes="(min-width: 1024px) 251px, 45vw"
                className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-105"
              />
            </div>
            <div className="w-full px-3 text-center">
              <h3 className="text-[clamp(1rem,0.9rem+0.35vw,1.25rem)] leading-[1.5] font-bold">{member.name}</h3>
              <p className="mt-0.5 text-[clamp(0.75rem,0.7rem+0.2vw,0.875rem)] leading-[1.18] font-medium text-role uppercase">
                {member.role}
              </p>
            </div>
          </article>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
