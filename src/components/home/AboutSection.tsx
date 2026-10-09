import { PillLink } from "@/components/ui/PillButton";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { Reveal } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";

export function AboutSection() {
  return (
    <section id="about" className="container-content scroll-mt-28 pt-[clamp(5rem,9vw,8.5rem)]">
      <SectionHeading>About Us</SectionHeading>
      <TextReveal
        text="Established In 2017, ADD Architects Is An Architectural Firm Based In Egypt"
        className="mt-[21px] text-display font-medium"
      />

      <div className="mt-8 grid gap-10 md:grid-cols-2 md:gap-x-[44px]">
        <ParallaxImage
          src="/images/home/about-1.webp"
          alt="Detail of a carved stone façade by ADD Architects"
          className="aspect-[526/728] w-full"
          objectPosition="35% 50%"
        />
        <div className="flex flex-col">
          <ParallaxImage
            src="/images/home/about-2.webp"
            alt="Rendered entrance plaza in front of a mosque"
            className="aspect-[526/474] w-full"
            strength={6}
          />
          <Reveal className="mt-auto flex flex-col items-start gap-[41px] pt-8 md:pl-[19px] md:pr-[9px]">
            <p className="md:text-justify text-[clamp(1.0625rem,0.95rem+0.4vw,1.25rem)] leading-[1.45]">
              At ADD Architects, We Believe That Exceptional Design Incorporates Not Only Aesthetics But
              Also Functionality And Sustainability, As Well As The Ability To Enhance The Lives Of Those
              Who Interact With The Built Environment.
            </p>
            <PillLink href="/about">Know more</PillLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
