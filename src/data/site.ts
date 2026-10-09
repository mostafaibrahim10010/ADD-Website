export const site = {
  name: "ADD Architects",
  shortName: "ADD",
  tagline: "Architecture Design + Development",
  description:
    "Innovative architectural solutions blending aesthetics, functionality, and sustainability. Based in Egypt, delivering excellence regionally and globally.",
  email: "info@addarchitects.net",
  address: ["17 Mostafa Fahmy,", "Gleem ,Alexandria, Egypt."],
  phones: [
    { label: "EG", value: "+20111-5111-825", href: "tel:+201115111825" },
    { label: "EG", value: "03-586-5567", href: "tel:035865567" },
    { label: "KSA", value: "+966508722707", href: "tel:+966508722707" },
  ],
  // Profile URLs were not part of the design file — fill these in when available.
  social: [
    { name: "X", icon: "/icons/x.svg", href: "#" },
    { name: "Instagram", icon: "/icons/instagram.svg", href: "#" },
    { name: "Facebook", icon: "/icons/facebook.svg", href: "#" },
    { name: "LinkedIn", icon: "/icons/linkedin.svg", href: "#" },
  ],
} as const;

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://addarchitects.net";

export const mainNav = [
  { label: "About Us", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Services", href: "/services" },
  { label: "Partners & Clients", href: "/partners" },
] as const;

export const footerFirmLinks = [
  { label: "About us", href: "/about" },
  { label: "Services & Projects", href: "/services" },
  { label: "Our expertise", href: "/services#expertise" },
  { label: "Key Partners & Clients", href: "/partners" },
  { label: "Our Articles & Blogs", href: "/#blog" },
] as const;

export const mapsUrl =
  "https://www.google.com/maps/search/?api=1&query=17+Mostafa+Fahmy+Gleem+Alexandria+Egypt";
