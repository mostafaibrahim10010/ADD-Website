import { PillLink } from "@/components/ui/PillButton";
import { Reveal } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";

export function Intro() {
  return (
    <section className="container-content pt-[clamp(4rem,7vw,6.5rem)]">
      <div className="grid gap-8 md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] md:gap-x-[42px]">
        <TextReveal
          as="h2"
          text={["Innovation Is At The", "Heart Of Everything", "We Do At ADD."]}
          className="text-intro font-medium"
        />
        <Reveal delay={0.2} className="flex flex-col items-start gap-[34px] md:pt-[34px]">
          <p className="md:text-justify text-[clamp(1.0625rem,0.95rem+0.4vw,1.25rem)] leading-[1.45]">
            We Are Constantly Exploring New Technologies, Materials, And Design Approaches To Push The
            Boundaries Of What Is Possible In The World Of Architecture.
          </p>
          <PillLink href="/contact">Contact us</PillLink>
        </Reveal>
      </div>
    </section>
  );
}
