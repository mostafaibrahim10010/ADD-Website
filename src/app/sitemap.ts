import type { MetadataRoute } from "next";
import { siteUrl } from "@/data/site";
import { allProjectPaths } from "@/data/projectRoutes";

const routes = [
  { path: "", priority: 1 },
  { path: "/about", priority: 0.8 },
  { path: "/services", priority: 0.8 },
  { path: "/partners", priority: 0.6 },
  { path: "/contact", priority: 0.7 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = routes.map(({ path, priority }) => ({
    url: `${siteUrl}${path}`,
    changeFrequency: "monthly" as const,
    priority,
  }));
  const projectPages = allProjectPaths().map((segments) => ({
    url: `${siteUrl}/projects/${segments.join("/")}`,
    changeFrequency: "monthly" as const,
    priority: segments[0] && ["architecture", "urban", "interior"].includes(segments[0]) ? 0.9 : 0.7,
  }));
  return [...pages, ...projectPages];
}
