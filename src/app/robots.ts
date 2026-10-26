import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

/** Indexation : tout l'espace public, jamais l'administration ni l'API. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
