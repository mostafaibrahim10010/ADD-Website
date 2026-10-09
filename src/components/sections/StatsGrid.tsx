import { stats } from "@/data/content";
import { cn } from "@/lib/cn";
import { CountUp } from "@/components/motion/CountUp";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";

/** 9+ / 15+ / 120+ cards with counting numbers. */
export function StatsGrid({ className }: { className?: string }) {
  return (
    <Stagger className={cn("grid gap-[19px] md:grid-cols-3", className)}>
      {stats.map((stat) => (
        <StaggerItem
          key={stat.title}
          className="flex flex-col gap-6 bg-surface pt-3.5 pr-3.5 pb-3.5 pl-[21px] md:min-h-[238px]"
        >
          <p className="text-[clamp(2.5rem,2rem+1.2vw,3.125rem)] leading-[1.3] font-medium">
            <CountUp to={stat.value} suffix={stat.suffix} />
          </p>
          <div>
            <h2 className="text-[clamp(1.125rem,1rem+0.4vw,1.375rem)] leading-[29px] font-medium capitalize">
              {stat.title}
            </h2>
            <p className="text-sm leading-[23px] capitalize">{stat.description}</p>
          </div>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
