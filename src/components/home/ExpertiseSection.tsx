import { SectionHeading } from "@/components/ui/SectionHeading";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { Reveal } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";

export function ExpertiseSection() {
  return (
    <section id="expertise" className="container-content scroll-mt-28 pt-[clamp(5rem,8vw,6.5rem)]">
      <SectionHeading>Our Expertise</SectionHeading>
      <TextReveal
        text={["Award-Winning Design & Construction", "Firm Delivering Innovative Solutions"]}
        className="mt-[15px] text-display-sm"
      />

      <div className="mt-4 grid gap-8 md:grid-cols-2 md:gap-x-[34px]">
        <ParallaxImage
          src="/images/home/expertise-1.webp"
          alt="ADD architects reviewing a heritage restoration on site"
          className="aspect-[524/701] w-full"
          objectPosition="40% 0%"
        />
        <div className="flex flex-col gap-[25px]">
          <ParallaxImage
            src="/images/home/expertise-2.webp"
            alt="Site supervision team inspecting reinforcement works"
            className="aspect-[524/451] w-full"
            strength={6}
          />
          <Reveal className="mt-auto">
            <p className="md:text-justify text-[clamp(1.0625rem,0.95rem+0.4vw,1.25rem)] leading-[1.45]">
              Our Expertise Covers The Full Spectrum Of The Design And Construction Process, From Initial
              Conceptualization To Final Execution. We Combine Creative Thinking, Technical Expertise, And
              Practical Experience To Deliver Thoughtful And Functional Solutions Tailored To Each Project.
              We Work Closely With Clients, Consultants, And Contractors To Ensure Coordination Throughout
              Every Stage.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
