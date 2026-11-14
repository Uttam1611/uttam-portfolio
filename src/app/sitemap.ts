import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(site.lastUpdated);
  const pages = ["", "/projects", "/journey", "/experience", "/certifications", "/analytics", "/about", "/contact"].map((p) => ({ url: `${site.url}${p}`, lastModified }));
  return [...pages, ...projects.map((p) => ({ url: `${site.url}/projects/${p.slug}`, lastModified }))];
}
