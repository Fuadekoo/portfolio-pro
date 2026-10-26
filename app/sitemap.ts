import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { absoluteUrl } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absoluteUrl("/"), changeFrequency: "monthly", priority: 1 },
    ...projects.map((p) => ({
      url: absoluteUrl(`/projects/${p.slug}`),
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
  ];
}
