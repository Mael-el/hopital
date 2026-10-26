import { and, asc, desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  donationNeeds,
  doctors,
  faqs,
  hospitalValues,
  news,
  pages,
  services,
  timelineEntries,
} from "@/db/schema";

export type PageContent = typeof pages.$inferSelect;

export async function getPage(slug: string): Promise<PageContent | null> {
  const rows = await db.select().from(pages).where(eq(pages.slug, slug)).limit(1);
  return rows[0] ?? null;
}

export async function getHomePage(): Promise<PageContent> {
  const page = await getPage("accueil");
  if (page) return page;
  return {
    slug: "accueil",
    title: "Hôpital La Croix de Zinvié",
    subtitle: "",
    body: "",
    data: {},
    updatedAt: new Date(),
  };
}

export async function getAboutPage(): Promise<PageContent> {
  const page = await getPage("a-propos");
  if (page) return page;
  return {
    slug: "a-propos",
    title: "À propos",
    subtitle: "",
    body: "",
    data: {},
    updatedAt: new Date(),
  };
}

export async function getPublishedServices() {
  return db
    .select()
    .from(services)
    .where(eq(services.published, true))
    .orderBy(asc(services.order), asc(services.name));
}

export async function getPrincipalServices() {
  const rows = await getPublishedServices();
  return rows.filter((service) => service.category === "principal");
}

export async function getServiceBySlug(slug: string) {
  const rows = await db
    .select()
    .from(services)
    .where(and(eq(services.slug, slug), eq(services.published, true)))
    .limit(1);
  return rows[0] ?? null;
}

export async function getPublishedDoctors() {
  return db
    .select()
    .from(doctors)
    .where(eq(doctors.published, true))
    .orderBy(asc(doctors.order), asc(doctors.name));
}

export async function getPublishedNews(limit?: number) {
  const query = db
    .select()
    .from(news)
    .where(eq(news.published, true))
    .orderBy(desc(news.publishedAt));

  if (limit) return query.limit(limit);
  return query;
}

export async function getNewsBySlug(slug: string) {
  const rows = await db
    .select()
    .from(news)
    .where(and(eq(news.slug, slug), eq(news.published, true)))
    .limit(1);
  return rows[0] ?? null;
}

export async function getPublishedFaqs() {
  return db
    .select()
    .from(faqs)
    .where(eq(faqs.published, true))
    .orderBy(asc(faqs.order), asc(faqs.id));
}

export async function getTimeline() {
  return db.select().from(timelineEntries).orderBy(asc(timelineEntries.order));
}

export async function getHospitalValues() {
  return db.select().from(hospitalValues).orderBy(asc(hospitalValues.order));
}

export async function getPublishedDonationNeeds() {
  return db
    .select()
    .from(donationNeeds)
    .where(eq(donationNeeds.published, true))
    .orderBy(asc(donationNeeds.order));
}

/** Montant total déjà collecté (dons réussis uniquement). */
export async function getTotalRaised(): Promise<number> {
  const result = await db.execute<{ total: string }>(
    sql`select coalesce(sum(amount), 0) as total from donations where status = 'success'`,
  );
  const row = result.rows[0];
  return row ? Number(row.total) : 0;
}

export async function getDonationCount(): Promise<number> {
  const result = await db.execute<{ count: string }>(
    sql`select count(*) as count from donations where status = 'success'`,
  );
  const row = result.rows[0];
  return row ? Number(row.count) : 0;
}

/** Montant collecté par affectation (dons réussis). */
export async function getRaisedByPurpose(): Promise<Record<string, number>> {
  const result = await db.execute<{ purpose: string; total: string }>(
    sql`select coalesce(nullif(purpose, ''), 'Fonds libres') as purpose, sum(amount)::int as total from donations where status = 'success' group by 1`,
  );
  const map: Record<string, number> = {};
  for (const row of result.rows) {
    map[row.purpose] = Number(row.total ?? 0);
  }
  return map;
}
