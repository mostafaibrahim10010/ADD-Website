import type { Metadata } from "next";
import Image from "next/image";
import { faqs, nextSteps } from "@/data/content";
import { mapsUrl, site } from "@/data/site";
import { PageHeader } from "@/components/ui/PageHeader";
import { PillAnchor } from "@/components/ui/PillButton";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/contact/ContactForm";
import { SocialLinks } from "@/components/layout/Footer";
import { FaqList } from "@/components/sections/FaqList";
import { StepList } from "@/components/sections/StepList";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Planning a new project? Contact ADD Architects in Alexandria, Egypt — info@addarchitects.net, +20 111 5111 825.",
  alternates: { canonical: "/contact" },
};

const detailLink = "transition-colors duration-300 hover:text-brand";
const label = "text-xs tracking-[0.18em] text-muted uppercase";
const section = "container-content scroll-mt-28 pt-[clamp(5rem,9vw,8rem)]";
const mapEmbed =
  "https://www.google.com/maps?q=ADD+Architects,+Al+Aqesa+WA+Baqos,+El+Raml+1,+Alexandria&z=16&output=embed";

export default function ContactPage() {
  return (
    <>
      <PageHeader
        crumb="Contact"
        title={["Planning A New Project?", "Let’s Discuss It With Our Team."]}
        lead={site.description}
      />

      {/* Details + form */}
      <section
        aria-label="Contact details and enquiry form"
        className="container-content grid gap-[clamp(3rem,6vw,5.5rem)] pt-[clamp(3.5rem,6vw,5.5rem)] lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]"
      >
        <div>
          <SectionHeading>Get in Touch</SectionHeading>
          <Stagger className="mt-8 flex flex-col gap-8" stagger={0.08}>
            <StaggerItem>
              <h3 className={label}>Studio</h3>
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className={`mt-2 flex gap-3 text-lg leading-snug ${detailLink}`}>
                <Image src="/icons/location.svg" alt="" width={24} height={24} className="mt-0.5 size-6 shrink-0" />
                <span>
                  {site.address[0]}
                  <br />
                  {site.address[1]}
                </span>
              </a>
            </StaggerItem>
            <StaggerItem>
              <h3 className={label}>Email</h3>
              <a href={`mailto:${site.email}`} className={`mt-2 flex items-center gap-3 text-lg ${detailLink}`}>
                <Image src="/icons/email.svg" alt="" width={24} height={24} className="size-6" />
                {site.email}
              </a>
            </StaggerItem>
            <StaggerItem>
              <h3 className={label}>Phone</h3>
              <ul className="mt-2 flex flex-col gap-1.5 text-lg">
                {site.phones.map((p) => (
                  <li key={p.value}>
                    <a href={p.href} className={`flex items-center gap-3 ${detailLink}`}>
                      <Image src="/icons/call.svg" alt="" width={24} height={24} className="size-6" />
                      <span>
                        <span className="text-muted">{p.label}</span> {p.value}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </StaggerItem>
            <StaggerItem>
              <h3 className={label}>Follow</h3>
              <div className="mt-3">
                <SocialLinks />
              </div>
            </StaggerItem>
          </Stagger>
        </div>

        <div>
          <SectionHeading>Project Enquiry</SectionHeading>
          <Reveal className="mt-8">
            <ContactForm />
          </Reveal>
        </div>
      </section>

      {/* Next steps */}
      <section aria-label="What happens next" className={section}>
        <SectionHeading>What Happens Next</SectionHeading>
        <TextReveal text="From First Message To First Meeting" className="mt-[21px] text-display-sm font-medium" />
        <div className="mt-[clamp(2.5rem,4vw,4rem)]">
          <StepList steps={nextSteps} columns={3} />
        </div>
      </section>

      {/* Visit */}
      <section aria-label="Visit the studio" className={section}>
        <SectionHeading>Visit The Studio</SectionHeading>
        <div className="mt-[clamp(1.5rem,3vw,2.5rem)] grid gap-[clamp(1rem,2vw,1.5rem)] lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <Reveal className="relative aspect-[16/10] overflow-hidden bg-surface lg:aspect-auto lg:min-h-[420px]">
            <iframe
              title="ADD Architects studio location on Google Maps"
              src={mapEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 size-full border-0 grayscale-[0.9] contrast-[1.05] transition-[filter] duration-700 hover:grayscale-0"
            />
          </Reveal>
          <Stagger className="flex flex-col gap-[clamp(1rem,2vw,1.5rem)]" stagger={0.1}>
            <StaggerItem className="flex flex-1 flex-col bg-surface p-[clamp(1.5rem,2.5vw,2.25rem)]">
              <p className={label}>Head Office · Egypt</p>
              <h3 className="mt-3 text-[clamp(1.25rem,1.1rem+0.5vw,1.625rem)] font-medium">Alexandria Studio</h3>
              <p className="mt-2 text-[15px] leading-[1.65] text-muted">
                {site.address[0]} {site.address[1]}
              </p>
              <p className="mt-1 text-[15px] text-muted">
                {site.phones[0].value} · {site.phones[1].value}
              </p>
              <div className="mt-auto pt-6">
                <PillAnchor href={mapsUrl} target="_blank" rel="noopener noreferrer">
                  Get Directions
                </PillAnchor>
              </div>
            </StaggerItem>
            <StaggerItem className="flex flex-1 flex-col bg-surface p-[clamp(1.5rem,2.5vw,2.25rem)]">
              <p className={label}>Saudi Arabia</p>
              <h3 className="mt-3 text-[clamp(1.25rem,1.1rem+0.5vw,1.625rem)] font-medium">KSA Projects</h3>
              <p className="mt-2 text-[15px] leading-[1.65] text-muted">
                Serving our projects in Riyadh and across the Kingdom.
              </p>
              <p className="mt-1 text-[15px] text-muted">{site.phones[2].value}</p>
              <div className="mt-auto pt-6">
                <PillAnchor href={site.phones[2].href}>Call KSA</PillAnchor>
              </div>
            </StaggerItem>
          </Stagger>
        </div>
      </section>

      {/* FAQ */}
      <section aria-label="Frequently asked questions" className={`${section} pb-[clamp(4rem,7vw,7.5rem)]`}>
        <SectionHeading>Frequently Asked Questions</SectionHeading>
        <div className="mt-[clamp(1.5rem,3vw,2.5rem)]">
          <FaqList items={faqs} />
        </div>
      </section>
    </>
  );
}
