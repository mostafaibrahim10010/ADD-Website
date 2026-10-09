import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PartnersGrid } from "@/components/sections/PartnersGrid";

export function PartnersSection() {
  return (
    <section id="partners" className="container-content scroll-mt-28 pt-[clamp(5rem,8vw,6.5rem)]">
      <SectionHeading>
        <Link href="/partners" className="transition-colors hover:text-brand">
          Key Partners &amp; Clients
        </Link>
      </SectionHeading>
      <PartnersGrid className="mt-[clamp(1.5rem,2.5vw,2.5rem)]" />
    </section>
  );
}
