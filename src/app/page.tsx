import { Hero } from "@/components/home/Hero";
import { ImageLoop } from "@/components/home/ImageLoop";
import { Intro } from "@/components/home/Intro";
import { AboutSection } from "@/components/home/AboutSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { ExpertiseSection } from "@/components/home/ExpertiseSection";
import { PartnersSection } from "@/components/home/PartnersSection";
import { BlogSection } from "@/components/home/BlogSection";
import { site, siteUrl } from "@/data/site";

// Structured data so search engines can show the studio's details.
const organizationLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: site.name,
  alternateName: "ADD",
  description: site.description,
  url: siteUrl,
  logo: `${siteUrl}/icon.svg`,
  image: `${siteUrl}/opengraph-image`,
  email: site.email,
  telephone: site.phones[0].value,
  foundingDate: "2017",
  address: {
    "@type": "PostalAddress",
    streetAddress: "17 Mostafa Fahmy, Gleem",
    addressLocality: "Alexandria",
    addressCountry: "EG",
  },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
      />
      <Hero />
      <ImageLoop />
      <Intro />
      <AboutSection />
      <ServicesSection />
      <ExpertiseSection />
      <PartnersSection />
      <BlogSection />
    </>
  );
}
