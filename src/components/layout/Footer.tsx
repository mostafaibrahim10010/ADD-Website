import Image from "next/image";
import Link from "next/link";
import { footerFirmLinks, mapsUrl, site } from "@/data/site";
import { services } from "@/data/content";
import { CtaBanner } from "./CtaBanner";
import { LogoFull } from "./Logo";

// Padding (not list gaps) spaces the links, so each one is a ≥40px tap target.
const linkClass =
  "inline-block py-2 font-alt text-base leading-[1.5] text-muted transition-colors duration-300 hover:text-brand";

function ColumnTitle({ children }: { children: string }) {
  return <h3 className="text-xl leading-[22px] font-medium [font-feature-settings:'lnum','pnum']">{children}</h3>;
}

export function SocialLinks({ size = 30 }: { size?: number }) {
  return (
    <ul className="flex items-center gap-[4.5px]">
      {site.social.map((s) => (
        <li key={s.name}>
          <a
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.name}
            className="block rounded-full transition-[transform,filter] duration-300 hover:-translate-y-0.5 hover:[filter:invert(17%)_sepia(80%)_saturate(3500%)_hue-rotate(347deg)_brightness(85%)]"
          >
            <Image src={s.icon} alt="" width={size} height={size} />
          </a>
        </li>
      ))}
    </ul>
  );
}

export function Footer() {
  return (
    <footer>
      <CtaBanner />
      <div className="bg-surface pt-[62px] pb-12">
        <div className="container-footer">
          <div className="grid gap-x-[61px] gap-y-12 sm:grid-cols-2 lg:grid-cols-[299px_226px_179px_160px_minmax(0,238px)]">
            <div className="flex flex-col gap-[17px]">
              <LogoFull />
              <p className="md:text-justify text-xs leading-[1.44] text-muted">{site.description}</p>
            </div>

            <div className="flex flex-col gap-[27px]">
              <ColumnTitle>Get in Touch</ColumnTitle>
              <address className="flex flex-col gap-[27px] not-italic">
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-[15px] leading-[1.36] text-muted transition-colors hover:text-brand"
                >
                  <Image src="/icons/location.svg" alt="" width={24} height={24} />
                  <span>
                    {site.address[0]}
                    <br />
                    {site.address[1]}
                  </span>
                </a>
                <a
                  href={`mailto:${site.email}`}
                  className="flex items-end gap-2.5 text-[15px] leading-[1.5] text-muted transition-colors hover:text-brand"
                >
                  <Image src="/icons/email.svg" alt="" width={24} height={24} />
                  {site.email}
                </a>
                <div className="flex items-center gap-[9px] text-[15px] leading-[1.5] text-muted">
                  <Image src="/icons/call.svg" alt="" width={24} height={24} />
                  <ul>
                    {site.phones.map((p) => (
                      <li key={p.value}>
                        <a href={p.href} className="inline-block py-1 transition-colors hover:text-brand md:py-0">
                          {p.label}: {p.value}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </address>
            </div>

            <nav aria-label="Services" className="flex flex-col gap-[18px]">
              <ColumnTitle>Service</ColumnTitle>
              <ul className="flex flex-col">
                {services.map((s) => (
                  <li key={s.slug}>
                    <Link href={`/services#${s.slug}`} className={linkClass}>
                      {s.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="Firm" className="flex flex-col gap-[18px]">
              <ColumnTitle>Firm</ColumnTitle>
              <ul className="flex flex-col">
                {footerFirmLinks.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className={linkClass}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex flex-col gap-4">
              <SocialLinks />
              <p className="text-xs leading-[1.5] text-muted">
                You can communicate with us and,
                <br />
                follow us on our social media platforms.
              </p>
            </div>
          </div>

          <p className="mt-[34px] font-alt text-sm leading-[1.5] text-muted">
            Copyright ADD Firm
          </p>
        </div>
      </div>
    </footer>
  );
}
