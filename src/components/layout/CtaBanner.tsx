"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { site } from "@/data/site";
import { PillLink } from "@/components/ui/PillButton";
import { Reveal } from "@/components/motion/Reveal";

/** "Planning a New Project?" banner that sits on top of the footer. */
export function CtaBanner() {
  // The contact page already is the call to action.
  return usePathname() === "/contact" ? null : <Banner />;
}

function Banner() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-18%", "18%"]);

  return (
    <section
      id="contact"
      ref={ref}
      aria-labelledby="cta-title"
      className="relative scroll-mt-24 overflow-hidden text-[#fcfcfc]"
    >
      <motion.div className="absolute inset-x-0 -top-[20%] -bottom-[20%]" style={{ y }}>
        <Image src="/images/cta-bg.webp" alt="" fill sizes="100vw" className="object-cover object-[50%_35%]" />
      </motion.div>
      <div aria-hidden className="absolute inset-0 bg-black/10" />

      <div className="container-footer relative flex flex-col gap-8 py-16 md:flex-row md:items-end md:justify-between md:gap-[111px] md:pt-[76px] md:pb-[70px]">
        <Reveal className="max-w-[1074px]">
          <h2 id="cta-title" className="text-[clamp(1.75rem,1.2rem+1.6vw,2.5rem)] leading-[1.22] font-medium">
            Planning a New Project?
            <br />
            Let’s discuss your project with our team.
          </h2>
          <p className="mt-1 text-[clamp(1.0625rem,0.9rem+0.6vw,1.5625rem)] leading-[1.44]">
            {site.description}
          </p>
        </Reveal>
        <Reveal delay={0.15} y={20} className="shrink-0">
          <PillLink href="/contact">Get in Touch</PillLink>
        </Reveal>
      </div>
    </section>
  );
}
