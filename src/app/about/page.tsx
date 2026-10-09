import type { Metadata } from "next";
import { awards } from "@/data/content";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { TeamGrid } from "@/components/about/TeamGrid";
import { StatsGrid } from "@/components/sections/StatsGrid";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Established in 2017, ADD Architects is an award-winning, multidisciplinary architectural firm based in Alexandria, Egypt.",
  alternates: { canonical: "/about" },
};

const bodyText = "md:text-justify text-[clamp(1.0625rem,0.95rem+0.45vw,1.375rem)] leading-[1.32]";

export default function AboutPage() {
  return (
    <>
      <div className="container-wide pt-[clamp(8rem,10.5vw,10.5rem)]">
        <Breadcrumb current="About Us" />
      </div>

      <div className="container-content pb-[clamp(4rem,7vw,5rem)]">
        {/* Established */}
        <section aria-label="Established" className="pt-[clamp(2.5rem,4vw,4rem)]">
          <ParallaxImage
            src="/images/about/about-01.webp"
            alt="Worshippers inside a restored hypostyle mosque hall with reflective floor"
            className="aspect-[1082/479] w-full"
            objectPosition="50% 46%"
            sizes="(min-width: 1120px) 1086px, 100vw"
            priority
          />
          <TextReveal
            text="Established In 2017, ADD Architects Is An Architectural Firm Based In Egypt"
            className="mt-[38px] text-display font-medium"
            as="h1"
          />

          <StatsGrid className="mt-[clamp(1.5rem,2.5vw,2.375rem)]" />

          <Reveal className="mt-[38px]">
            <p className={`${bodyText} capitalize`}>
              Established in Alexandria in 2017, ADD Architects is an award-winning architectural practice
              driven by a commitment to innovation, thoughtful design, and lasting impact. Over the years, ADD
              has grown from an architectural and interior design team into a multidisciplinary practice,
              expanding its expertise across architecture, urban design, interior design, BIM, engineering,
              and project delivery. Our experience spans a diverse range of projects across Egypt and the
              region, from residential and commercial developments to large-scale urban projects and
              culturally significant sites.
            </p>
          </Reveal>
        </section>

        {/* Awards */}
        <section aria-label="Awards & Global Recognition" className="pt-[clamp(3rem,5vw,4.75rem)]">
          <div className="grid gap-[15px] md:h-[650px] md:grid-cols-2 md:grid-rows-2 md:gap-y-4">
            <ParallaxImage
              src="/images/about/about-02.webp"
              alt="ADD Architects team at the Hear Baghdad Arab architecture festival 2025"
              className="aspect-[4/5] md:row-span-2 md:aspect-auto"
              objectPosition="38% 50%"
            />
            <ParallaxImage
              src="/images/about/about-03.webp"
              alt="Presenting on stage at an architecture conference"
              className="aspect-[533/317] md:aspect-auto"
              strength={5}
            />
            <ParallaxImage
              src="/images/about/about-04.webp"
              alt="Receiving the AIA Middle East award in Jordan, 2025"
              className="aspect-[533/317] md:aspect-auto"
              strength={5}
              objectPosition="50% 30%"
            />
          </div>

          <TextReveal
            text="Awards & Global Recognition"
            className="mt-[25px] text-display font-medium capitalize"
          />
          <Stagger className="mt-7 flex flex-col gap-[29px]" stagger={0.1}>
            {awards.map((award) => (
              <StaggerItem key={award.title}>
                <h3
                  className="text-[clamp(1.25rem,1rem+0.9vw,2rem)] leading-[1.15] font-semibold capitalize"
                >
                  - {award.title}
                </h3>
                <p className={`${bodyText} mt-1 capitalize`}>{award.description}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </section>

        {/* Leadership */}
        <section aria-label="Leadership & Collaborative Team" className="pt-[clamp(4rem,6vw,6rem)]">
          <ParallaxImage
            src="/images/about/about-05.webp"
            alt="Waterfront rendering of the Dakeer Island project in Basra"
            className="aspect-[1082/402] w-full"
            objectPosition="50% 48%"
            sizes="(min-width: 1120px) 1086px, 100vw"
          />
          <TextReveal
            text="Leadership & Collaborative Team"
            className="mt-[25px] text-display font-medium capitalize"
          />
          <Reveal className="mt-[25px] flex flex-col gap-[29px]">
            <p className={`${bodyText} capitalize`}>
              At ADD Architects, professional experience and continuous exploration come together to create an
              environment where ideas are developed through dialogue, research, and collaboration. The
              diversity of the team, combined with an ongoing commitment to learning and innovation, enables
              the practice to approach each project with a distinctive perspective while remaining grounded in
              its cultural, environmental, and architectural context.
            </p>
            <p className={`${bodyText} capitalize`}>
              At the core of the practice is{" "}
              <strong className="font-semibold">Dr. Sherif Farag, founder and CEO of ADD Architects,</strong>{" "}
              whose professional career combines architectural practice with academic engagement. Holding a
              Ph.D. in Architecture from Alexandria University and contributing to architectural education at
              the Faculty of Fine Arts, Alexandria University, he brings a perspective shaped by both practice
              and research. His work reflects a sustained interest in architectural design, heritage, and the
              development of thoughtful approaches to the design process, contributing to the intellectual and
              professional direction of the practice.
            </p>
          </Reveal>

          <div className="mt-[clamp(3rem,5vw,5rem)]">
            <TeamGrid />
          </div>
        </section>
      </div>
    </>
  );
}
