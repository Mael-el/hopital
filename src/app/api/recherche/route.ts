import { and, desc, eq, ilike, or } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { doctors, faqs, news, services } from "@/db/schema";

export const dynamic = "force-dynamic";

export type SearchResult = {
  type: "service" | "medecin" | "actualite" | "faq";
  typeLabel: string;
  title: string;
  text: string;
  href: string;
};

export async function GET(req: Request) {
  const url = new URL(req.url);
  const query = (url.searchParams.get("q") ?? "").trim().slice(0, 80);

  if (query.length < 2) {
    return NextResponse.json({ results: [] as SearchResult[] });
  }

  const like = `%${query}%`;

  const [serviceRows, doctorRows, newsRows, faqRows] = await Promise.all([
    db
      .select({
        title: services.name,
        text: services.shortDescription,
        href: services.slug,
      })
      .from(services)
      .where(
        and(
          eq(services.published, true),
          or(
            ilike(services.name, like),
            ilike(services.shortDescription, like),
            ilike(services.description, like),
          ),
        ),
      )
      .limit(5),
    db
      .select({
        title: doctors.name,
        text: doctors.specialty,
        serviceSlug: services.slug,
      })
      .from(doctors)
      .leftJoin(services, eq(doctors.serviceId, services.id))
      .where(
        and(
          eq(doctors.published, true),
          or(ilike(doctors.name, like), ilike(doctors.specialty, like)),
        ),
      )
      .limit(5),
    db
      .select({
        title: news.title,
        text: news.excerpt,
        href: news.slug,
        publishedAt: news.publishedAt,
      })
      .from(news)
      .where(
        and(
          eq(news.published, true),
          or(ilike(news.title, like), ilike(news.excerpt, like)),
        ),
      )
      .orderBy(desc(news.publishedAt))
      .limit(5),
    db
      .select({ title: faqs.question, text: faqs.answer })
      .from(faqs)
      .where(
        and(eq(faqs.published, true), or(ilike(faqs.question, like), ilike(faqs.answer, like))),
      )
      .limit(5),
  ]);

  const results: SearchResult[] = [
    ...serviceRows.map((row) => ({
      type: "service" as const,
      typeLabel: "Service",
      title: row.title,
      text: row.text,
      href: `/services/${row.href}`,
    })),
    ...doctorRows.map((row) => ({
      type: "medecin" as const,
      typeLabel: "Praticien",
      title: row.title,
      text: row.text,
      href: row.serviceSlug ? `/medecins?service=${row.serviceSlug}` : "/medecins",
    })),
    ...newsRows.map((row) => ({
      type: "actualite" as const,
      typeLabel: "Actualité",
      title: row.title,
      text: row.text,
      href: `/actualites/${row.href}`,
    })),
    ...faqRows.map((row) => ({
      type: "faq" as const,
      typeLabel: "Question fréquente",
      title: row.title,
      text: row.text,
      href: "/faq",
    })),
  ];

  return NextResponse.json({ results });
}
