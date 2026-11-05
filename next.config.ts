import type { NextConfig } from "next";

/** Old project slug → new slug. */
const RENAMED_PROJECTS: Record<string, string> = {
  "siwa-residential-compound": "siwa-horizons",
  aba: "aba-headquarters",
  carthage: "carthage-national-museum",
  "dar-yamama-residentail-compound": "afaq-compound",
  "yamama-bussniss-hub": "madar-business-hub",
  "iraq-villa": "mashrabiya-house",
  "office-101": "copper-canopy",
  "sodic-villa": "sunwashed-house",
  "gleem-flat": "salt-and-oak-apartment",
  "palm-hills-villa": "ivory-and-bronze-villa",
  "sawary-flat-01": "bespoke-apartment",
  "sawary-flat-02": "gold-hour-apartment",
  "suliman-al-majed": "royal-residence-complex-interior",
  "sanstefano-flat": "ink-and-bloom-apartment",
  "al-olaya": "al-yamama",
  "gamila-flat": "olive-branch-apartment",
};

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  experimental: {
    agentUpgrade: "security",
  },
  // Hide the floating "N" dev-mode badge (errors are still shown).
  devIndicators: false,
  images: {
    formats: ["image/avif", "image/webp"],
    // A single, high quality level: every <Image> (default 75) is served at 90.
    qualities: [90],
  },
  // Baseline security headers for every route.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // Projects renamed in the October 2026 portfolio update.
      ...Object.entries(RENAMED_PROJECTS).map(([from, to]) => ({
        source: `/projects/${from}`,
        destination: `/projects/${to}`,
        permanent: true,
      })),
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
