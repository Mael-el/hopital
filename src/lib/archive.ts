import { and, eq, isNull, lt, or } from "drizzle-orm";
import { db } from "@/db";
import {
  archives,
  consultationRequests,
  contactMessages,
  donations,
  donationNeeds,
  doctors,
  faqs,
  news,
  services,
} from "@/db/schema";

/**
 * Archivage automatique : toute donnée inactive depuis plus de 30 jours
 * (ni consultée, ni modifiée) est déplacée vers la table `archives`.
 * Les données archivées quittent la liste active mais restent consultables.
 */
export const ARCHIVE_AFTER_DAYS = 30;

export function archiveThreshold(): Date {
  return new Date(Date.now() - ARCHIVE_AFTER_DAYS * 86_400_000);
}

export type ArchivalReport = {
  archived: number;
  byType: Record<string, number>;
  threshold: string;
};

/** Les contenus publiés restent visibles sur le site : seuls les contenus
 *  dépubliés et inactifs sont archivés. */
const CONTENT_SOURCES = [
  { table: services, type: "service", label: (row: typeof services.$inferSelect) => row.name },
  { table: doctors, type: "doctor", label: (row: typeof doctors.$inferSelect) => row.name },
  { table: news, type: "news", label: (row: typeof news.$inferSelect) => row.title },
  { table: faqs, type: "faq", label: (row: typeof faqs.$inferSelect) => row.question },
  {
    table: donationNeeds,
    type: "donation_need",
    label: (row: typeof donationNeeds.$inferSelect) => row.title,
  },
] as const;

export async function runArchival(): Promise<ArchivalReport> {
  const threshold = archiveThreshold();
  const byType: Record<string, number> = {};

  /* ---- Demandes de consultation ---- */
  const staleRequests = await db
    .select()
    .from(consultationRequests)
    .where(lt(consultationRequests.lastActivityAt, threshold));

  for (const row of staleRequests) {
    await db.insert(archives).values({
      entityType: "consultation_request",
      entityId: row.id,
      label: `${row.fullName} — ${row.serviceLabel}`,
      payload: row as unknown as Record<string, unknown>,
      retentionUntil: new Date(
        Date.now() + 730 * 86_400_000,
      ),
    });
    await db
      .delete(consultationRequests)
      .where(eq(consultationRequests.id, row.id));
    byType.consultation_request = (byType.consultation_request ?? 0) + 1;
  }

  /* ---- Dons ---- */
  const staleDonations = await db
    .select()
    .from(donations)
    .where(lt(donations.lastActivityAt, threshold));

  for (const row of staleDonations) {
    await db.insert(archives).values({
      entityType: "donation",
      entityId: row.id,
      label: `${row.reference} — ${row.amount} FCFA`,
      payload: row as unknown as Record<string, unknown>,
      retentionUntil: new Date(Date.now() + 730 * 86_400_000),
    });
    await db.delete(donations).where(eq(donations.id, row.id));
    byType.donation = (byType.donation ?? 0) + 1;
  }

  /* ---- Messages de contact ---- */
  const staleMessages = await db
    .select()
    .from(contactMessages)
    .where(lt(contactMessages.lastActivityAt, threshold));

  for (const row of staleMessages) {
    await db.insert(archives).values({
      entityType: "contact_message",
      entityId: row.id,
      label: `${row.fullName} — ${row.subject}`,
      payload: row as unknown as Record<string, unknown>,
      retentionUntil: new Date(Date.now() + 730 * 86_400_000),
    });
    await db.delete(contactMessages).where(eq(contactMessages.id, row.id));
    byType.contact_message = (byType.contact_message ?? 0) + 1;
  }

  /* ---- Contenus dépubliés ---- */
  for (const source of CONTENT_SOURCES) {
    const stale = await db
      .select()
      .from(source.table)
      .where(
        and(
          eq(source.table.published, false),
          lt(source.table.lastActivityAt, threshold),
        ),
      );

    for (const row of stale) {
      await db.insert(archives).values({
        entityType: source.type,
        entityId: row.id,
        label: source.label(row as never),
        payload: row as unknown as Record<string, unknown>,
        retentionUntil: new Date(Date.now() + 730 * 86_400_000),
      });
      await db.delete(source.table).where(eq(source.table.id, row.id));
      byType[source.type] = (byType[source.type] ?? 0) + 1;
    }
  }

  const archived = Object.values(byType).reduce((sum, n) => sum + n, 0);
  return { archived, byType, threshold: threshold.toISOString() };
}

/** Marque une donnée comme consultée / modifiée ( activité récente ). */
export async function touchRequest(id: number): Promise<void> {
  await db
    .update(consultationRequests)
    .set({ lastActivityAt: new Date() })
    .where(eq(consultationRequests.id, id));
}

export async function touchDonation(id: number): Promise<void> {
  await db
    .update(donations)
    .set({ lastActivityAt: new Date() })
    .where(eq(donations.id, id));
}

export async function touchMessage(id: number): Promise<void> {
  await db
    .update(contactMessages)
    .set({ lastActivityAt: new Date() })
    .where(eq(contactMessages.id, id));
}

export { isNull, or };
