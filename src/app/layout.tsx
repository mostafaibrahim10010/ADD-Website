import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Questrial } from "next/font/google";
import { Providers } from "@/components/layout/Providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { site, siteUrl } from "@/data/site";
import "./globals.css";

// Latin subset of the brand's Montserrat variable font (55 KB woff2).
const montserrat = localFont({
  src: "./fonts/Montserrat-Latin.woff2",
  weight: "100 900",
  style: "normal",
  variable: "--font-montserrat",
  display: "swap",
});

const questrial = Questrial({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-questrial",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ADD",
    template: "%s | ADD",
  },
  description: site.description,
  applicationName: "ADD",
  authors: [{ name: site.name }],
  keywords: [
    "ADD Architects",
    "architecture firm Egypt",
    "Alexandria architects",
    "urban design",
    "interior design",
    "BIM services",
    "construction supervision",
    "project management",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: "ADD",
    description: site.description,
    url: "/",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "ADD",
    description: site.description,
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${montserrat.variable} ${questrial.variable}`}>
      <body className="min-h-dvh bg-white font-sans text-ink">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <Providers>
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
