import type { MetadataRoute } from "next";

import { getPublishedNews, getPublishedServices } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

const STATIC_ROUTES = [
  "",
  "/a-propos",
  "/services",
  "/medecins",
  "/actualites",
  "/consultation",
  "/dons",
  "/faq",
  "/contact",
  "/triage",
  "/fiche-imprimable",
];

/** Plan du site pour les moteurs de recherche (pages + services + actualités). */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, news] = await Promise.all([
    getPublishedServices(),
    getPublishedNews(),
  ]);
  const now = new Date();

  return [
    ...STATIC_ROUTES.map((route) => ({
      url: `${SITE_URL}${route}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1 : 0.8,
    })),
    ...services.map((service) => ({
      url: `${SITE_URL}/services/${service.slug}`,
      lastModified: service.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...news.map((article) => ({
      url: `${SITE_URL}/actualites/${article.slug}`,
      lastModified: article.publishedAt ?? article.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
