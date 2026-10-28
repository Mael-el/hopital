"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import {
  contactMessages,
  consultationRequests,
  donationNeeds,
  donations,
  doctors,
  faqs,
  hospitalValues,
  news,
  pages,
  services,
  timelineEntries,
} from "@/db/schema";
import { runArchival } from "@/lib/archive";
import { authenticate, assertUser, createSession, destroySession } from "@/lib/auth";
import { saveSettings } from "@/lib/settings";
import { sanitizeMultiline, sanitizeText } from "@/lib/validation";

/* ------------------------------------------------------------------ */
/* Utilitaires                                                         */
/* ------------------------------------------------------------------ */

function str(formData: FormData, key: string, max = 4000): string {
  const value = formData.get(key);
  return typeof value === "string" ? sanitizeText(value, max) : "";
}

function longStr(formData: FormData, key: string, max = 12000): string {
  const value = formData.get(key);
  return typeof value === "string" ? sanitizeMultiline(value, max) : "";
}

function int(formData: FormData, key: string, fallback = 0): number {
  const value = Number(formData.get(key));
  return Number.isFinite(value) ? Math.trunc(value) : fallback;
}

function bool(formData: FormData, key: string): boolean {
  return formData.get(key) === "on" || formData.get(key) === "true";
}


function parseLines(raw: string): string[][] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.split("|").map((part) => part.trim()));
}

function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

async function uniqueSlug(
  table: typeof services | typeof news,
  base: string,
  currentId?: number,
): Promise<string> {
  let candidate = slugify(base) || "element";
  let suffix = 1;
  for (;;) {
    const rows = await db
      .select({ id: table.id, slug: table.slug })
      .from(table)
      .where(eq(table.slug, candidate))
      .limit(1);
    const clash = rows[0];
    if (!clash || clash.id === currentId) return candidate;
    suffix += 1;
    candidate = `${slugify(base)}-${suffix}`;
  }
}

/* ------------------------------------------------------------------ */
/* Authentification                                                     */
/* ------------------------------------------------------------------ */

export async function loginAction(formData: FormData) {
  const username = str(formData, "username", 80);
  const password = typeof formData.get("password") === "string" ? String(formData.get("password")) : "";

  if (!username || !password) {
    redirect("/admin/connexion?erreur=identifiants");
  }

  const user = await authenticate(username, password);
  if (!user) {
    redirect("/admin/connexion?erreur=identifiants");
  }

  await createSession(user.id);
  redirect("/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/connexion");
}

/* ------------------------------------------------------------------ */
/* Contenus : accueil & à propos                                        */
/* ------------------------------------------------------------------ */

export async function updateHomePage(formData: FormData) {
  await assertUser(["admin", "content"]);

  const current = await db
    .select()
    .from(pages)
    .where(eq(pages.slug, "accueil"))
    .limit(1);
  const previous = (current[0]?.data ?? {}) as Record<string, unknown>;

  const pillars = (previous.pillars as { title: string; text: string; icon: string }[]) ?? [];

  const data = {
    ...previous,
    heroKicker: str(formData, "heroKicker", 200),
    heroTitle: str(formData, "heroTitle", 200),
    heroText: longStr(formData, "heroText", 1200),
    primaryCta: str(formData, "primaryCta", 80),
    secondaryCta: str(formData, "secondaryCta", 80),
    stats: [1, 2, 3, 4].map((index) => ({
      value: str(formData, `stat${index}Value`, 40),
      label: str(formData, `stat${index}Label`, 80),
    })),
    pillars: pillars.map((pillar, index) => ({
      ...pillar,
      title: str(formData, `pillar${index + 1}Title`, 120),
      text: longStr(formData, `pillar${index + 1}Text`, 600),
    })),
  };

  const title = str(formData, "title", 200);
  const subtitle = str(formData, "subtitle", 300);
  const body = longStr(formData, "body", 6000);

  if (current.length === 0) {
    await db.insert(pages).values({ slug: "accueil", title, subtitle, body, data });
  } else {
    await db
      .update(pages)
      .set({ title, subtitle, body, data, updatedAt: new Date() })
      .where(eq(pages.slug, "accueil"));
  }

  revalidatePath("/");
  revalidatePath("/admin/contenus/accueil");
}

export async function updateAboutPage(formData: FormData) {
  await assertUser(["admin", "content"]);

  const current = await db
    .select()
    .from(pages)
    .where(eq(pages.slug, "a-propos"))
    .limit(1);
  const previous = (current[0]?.data ?? {}) as Record<string, unknown>;
  const directions = (previous.directions as { name: string; role: string; text: string }[]) ?? [];

  const data = {
    ...previous,
    missionTitle: str(formData, "missionTitle", 150),
    missionText: longStr(formData, "missionText", 2000),
    visionTitle: str(formData, "visionTitle", 150),
    visionText: longStr(formData, "visionText", 2000),
    storyIntro: longStr(formData, "storyIntro", 4000),
    partnershipText: longStr(formData, "partnershipText", 2000),
    directions: directions.map((direction, index) => ({
      name: str(formData, `direction${index + 1}Name`, 120),
      role: str(formData, `direction${index + 1}Role`, 120),
      text: longStr(formData, `direction${index + 1}Text`, 600),
    })),
  };

  const title = str(formData, "title", 200);
  const subtitle = str(formData, "subtitle", 300);
  const body = longStr(formData, "body", 4000);

  if (current.length === 0) {
    await db.insert(pages).values({ slug: "a-propos", title, subtitle, body, data });
  } else {
    await db
      .update(pages)
      .set({ title, subtitle, body, data, updatedAt: new Date() })
      .where(eq(pages.slug, "a-propos"));
  }

  revalidatePath("/a-propos");
  revalidatePath("/admin/contenus/a-propos");
}

/* ------------------------------------------------------------------ */
/* Services                                                            */
/* ------------------------------------------------------------------ */

export async function saveService(formData: FormData) {
  await assertUser(["admin", "content"]);
  const id = int(formData, "id", 0);
  const name = str(formData, "name", 150);
  const slug = await uniqueSlug(services, str(formData, "slug", 120) || name, id || undefined);

  const values = {
    slug,
    name,
    category: str(formData, "category", 40) || "principal",
    shortDescription: longStr(formData, "shortDescription", 400),
    description: longStr(formData, "description", 6000),
    hours: str(formData, "hours", 150),
    location: str(formData, "location", 200),
    headName: str(formData, "headName", 200),
    icon: str(formData, "icon", 40) || "stethoscope",
    appointment: bool(formData, "appointment"),
    order: int(formData, "order", 0),
    published: bool(formData, "published"),
    updatedAt: new Date(),
  };

  if (id) {
    await db.update(services).set(values).where(eq(services.id, id));
  } else {
    await db.insert(services).values({ ...values, published: values.published });
  }

  revalidatePath("/services");
  revalidatePath("/");
  revalidatePath("/admin/services");
}

export async function deleteService(formData: FormData) {
  await assertUser(["admin", "content"]);
  const id = int(formData, "id", 0);
  await db.delete(services).where(eq(services.id, id));
  revalidatePath("/services");
  revalidatePath("/admin/services");
}

export async function toggleServicePublished(id: number, published: boolean) {
  await assertUser(["admin", "content"]);
  await db
    .update(services)
    .set({ published, updatedAt: new Date(), lastActivityAt: new Date() })
    .where(eq(services.id, id));
  revalidatePath("/services");
  revalidatePath("/admin/services");
}

/* ------------------------------------------------------------------ */
/* Médecins                                                            */
/* ------------------------------------------------------------------ */

export async function saveDoctor(formData: FormData) {
  await assertUser(["admin", "content"]);
  const id = int(formData, "id", 0);
  const serviceId = int(formData, "serviceId", 0);

  const values = {
    name: str(formData, "name", 150),
    kind: str(formData, "kind", 20) || "medecin",
    specialty: str(formData, "specialty", 200),
    serviceId: serviceId ? serviceId : null,
    role: str(formData, "role", 200),
    days: str(formData, "days", 200),
    hours: str(formData, "hours", 100),
    bio: longStr(formData, "bio", 3000),
    order: int(formData, "order", 0),
    published: bool(formData, "published"),
    updatedAt: new Date(),
  };

  if (id) {
    await db.update(doctors).set(values).where(eq(doctors.id, id));
  } else {
    await db.insert(doctors).values(values);
  }

  revalidatePath("/medecins");
  revalidatePath("/admin/medecins");
}

export async function deleteDoctor(formData: FormData) {
  await assertUser(["admin", "content"]);
  const id = int(formData, "id", 0);
  await db.delete(doctors).where(eq(doctors.id, id));
  revalidatePath("/medecins");
  revalidatePath("/admin/medecins");
}

/* ------------------------------------------------------------------ */
/* Actualités                                                          */
/* ------------------------------------------------------------------ */

export async function saveNews(formData: FormData) {
  await assertUser(["admin", "content"]);
  const id = int(formData, "id", 0);
  const title = str(formData, "title", 250);
  const slug = await uniqueSlug(news, str(formData, "slug", 150) || title, id || undefined);
  const publishedAtRaw = str(formData, "publishedAt", 40);
  const publishedAt = publishedAtRaw ? new Date(publishedAtRaw) : new Date();

  const values = {
    slug,
    title,
    excerpt: longStr(formData, "excerpt", 800),
    content: longStr(formData, "content", 12000),
    category: str(formData, "category", 60) || "Actualité",
    author: str(formData, "author", 150) || "Hôpital La Croix de Zinvié",
    published: bool(formData, "published"),
    publishedAt: Number.isNaN(publishedAt.getTime()) ? new Date() : publishedAt,
    updatedAt: new Date(),
  };

  if (id) {
    await db.update(news).set(values).where(eq(news.id, id));
  } else {
    await db.insert(news).values(values);
  }

  revalidatePath("/actualites");
  revalidatePath("/");
  revalidatePath("/admin/actualites");
}

export async function deleteNews(formData: FormData) {
  await assertUser(["admin", "content"]);
  const id = int(formData, "id", 0);
  await db.delete(news).where(eq(news.id, id));
  revalidatePath("/actualites");
  revalidatePath("/");
  revalidatePath("/admin/actualites");
}

/* ------------------------------------------------------------------ */
/* FAQ                                                                 */
/* ------------------------------------------------------------------ */

export async function saveFaq(formData: FormData) {
  await assertUser(["admin", "content"]);
  const id = int(formData, "id", 0);

  const values = {
    question: str(formData, "question", 300),
    answer: longStr(formData, "answer", 4000),
    category: str(formData, "category", 60) || "Général",
    order: int(formData, "order", 0),
    published: bool(formData, "published"),
    updatedAt: new Date(),
  };

  if (id) {
    await db.update(faqs).set(values).where(eq(faqs.id, id));
  } else {
    await db.insert(faqs).values(values);
  }

  revalidatePath("/faq");
  revalidatePath("/admin/faq");
}

export async function deleteFaq(formData: FormData) {
  await assertUser(["admin", "content"]);
  const id = int(formData, "id", 0);
  await db.delete(faqs).where(eq(faqs.id, id));
  revalidatePath("/faq");
  revalidatePath("/admin/faq");
}

/* ------------------------------------------------------------------ */
/* Besoins de dons, frise, valeurs                                      */
/* ------------------------------------------------------------------ */

export async function saveDonationNeed(formData: FormData) {
  await assertUser(["admin", "content"]);
  const id = int(formData, "id", 0);

  const values = {
    title: str(formData, "title", 150),
    description: longStr(formData, "description", 1000),
    icon: str(formData, "icon", 40) || "cross",
    targetAmount: int(formData, "targetAmount", 0),
    order: int(formData, "order", 0),
    published: bool(formData, "published"),
    updatedAt: new Date(),
  };

  if (id) {
    await db.update(donationNeeds).set(values).where(eq(donationNeeds.id, id));
  } else {
    await db.insert(donationNeeds).values(values);
  }

  revalidatePath("/dons");
  revalidatePath("/admin/parametres");
}

export async function deleteDonationNeed(formData: FormData) {
  await assertUser(["admin", "content"]);
  const id = int(formData, "id", 0);
  await db.delete(donationNeeds).where(eq(donationNeeds.id, id));
  revalidatePath("/dons");
}

export async function saveTimelineEntry(formData: FormData) {
  await assertUser(["admin", "content"]);
  const id = int(formData, "id", 0);
  const values = {
    year: str(formData, "year", 20),
    title: str(formData, "title", 200),
    description: longStr(formData, "description", 1500),
    order: int(formData, "order", 0),
  };

  if (id) {
    await db.update(timelineEntries).set(values).where(eq(timelineEntries.id, id));
  } else {
    await db.insert(timelineEntries).values(values);
  }

  revalidatePath("/a-propos");
  revalidatePath("/admin/contenus/a-propos");
}

export async function deleteTimelineEntry(formData: FormData) {
  await assertUser(["admin", "content"]);
  const id = int(formData, "id", 0);
  await db.delete(timelineEntries).where(eq(timelineEntries.id, id));
  revalidatePath("/a-propos");
}

export async function saveHospitalValue(formData: FormData) {
  await assertUser(["admin", "content"]);
  const id = int(formData, "id", 0);
  const values = {
    title: str(formData, "title", 150),
    description: longStr(formData, "description", 1500),
    icon: str(formData, "icon", 40) || "heart",
    order: int(formData, "order", 0),
  };

  if (id) {
    await db.update(hospitalValues).set(values).where(eq(hospitalValues.id, id));
  } else {
    await db.insert(hospitalValues).values(values);
  }

  revalidatePath("/a-propos");
  revalidatePath("/admin/contenus/a-propos");
}

export async function deleteHospitalValue(formData: FormData) {
  await assertUser(["admin", "content"]);
  const id = int(formData, "id", 0);
  await db.delete(hospitalValues).where(eq(hospitalValues.id, id));
  revalidatePath("/a-propos");
}

/* ------------------------------------------------------------------ */
/* Demandes de consultation                                            */
/* ------------------------------------------------------------------ */

export async function setRequestStatus(formData: FormData) {
  await assertUser(["admin", "requests"]);
  const id = int(formData, "id", 0);
  const status = str(formData, "status", 20) === "processed" ? "processed" : "pending";
  const adminNote = longStr(formData, "adminNote", 2000);

  await db
    .update(consultationRequests)
    .set({ status, adminNote, updatedAt: new Date(), lastActivityAt: new Date() })
    .where(eq(consultationRequests.id, id));

  revalidatePath("/admin/demandes");
}

export async function deleteRequest(formData: FormData) {
  await assertUser(["admin"]);
  const id = int(formData, "id", 0);
  await db.delete(consultationRequests).where(eq(consultationRequests.id, id));
  revalidatePath("/admin/demandes");
}

/* ------------------------------------------------------------------ */
/* Dons                                                                */
/* ------------------------------------------------------------------ */

export async function setDonationStatus(formData: FormData) {
  await assertUser(["admin", "requests"]);
  const id = int(formData, "id", 0);
  const raw = str(formData, "status", 20);
  const status = raw === "success" ? "success" : raw === "failed" ? "failed" : "pending";

  await db
    .update(donations)
    .set({ status, updatedAt: new Date(), lastActivityAt: new Date() })
    .where(eq(donations.id, id));

  revalidatePath("/admin/dons");
}

export async function markReceiptSent(id: number) {
  await assertUser(["admin", "requests"]);
  await db
    .update(donations)
    .set({ receiptSent: true, updatedAt: new Date(), lastActivityAt: new Date() })
    .where(eq(donations.id, id));
  revalidatePath("/admin/dons");
}

/* ------------------------------------------------------------------ */
/* Messages de contact                                                  */
/* ------------------------------------------------------------------ */

export async function setMessageStatus(formData: FormData) {
  await assertUser(["admin", "requests"]);
  const id = int(formData, "id", 0);
  const raw = str(formData, "status", 20);
  const status =
    raw === "processed" ? "processed" : raw === "read" ? "read" : "new";

  await db
    .update(contactMessages)
    .set({ status, updatedAt: new Date(), lastActivityAt: new Date() })
    .where(eq(contactMessages.id, id));

  revalidatePath("/admin/messages");
}

/* ------------------------------------------------------------------ */
/* Archivage & paramètres                                               */
/* ------------------------------------------------------------------ */

export async function runArchiveNow(): Promise<void> {
  await assertUser(["admin"]);
  await runArchival();
  revalidatePath("/admin/archives");
  revalidatePath("/admin");
}

export async function updateSettings(formData: FormData) {
  await assertUser(["admin"]);

  const methods = [1, 2, 3]
    .map((index) => ({
      name: str(formData, `method${index}Name`, 80),
      detail: str(formData, `method${index}Detail`, 300),
    }))
    .filter((method) => method.name.length > 0);

  const contactChannels = parseLines(str(formData, "contactChannels", 6000))
    .filter((parts) => parts[0] && parts[1])
    .map((parts) => ({
      label: parts[0],
      value: parts[1],
      detail: parts[2] ?? "",
    }));

  const socialLinks = parseLines(str(formData, "socialLinks", 6000))
    .filter((parts) => parts[2])
    .map((parts) => ({
      platform: parts[0] || "globe",
      label: parts[1] || parts[2],
      url: parts[2],
    }));

  const webLinks = parseLines(str(formData, "webLinks", 6000))
    .filter((parts) => parts[1])
    .map((parts) => ({ label: parts[0], url: parts[1] }));

  const staffStats = parseLines(str(formData, "staffStats", 4000))
    .filter((parts) => parts[0] && parts[1])
    .map((parts) => ({ value: parts[0], label: parts[1] }));

  await saveSettings({
    hospitalName: str(formData, "hospitalName", 150),
    legalName: str(formData, "legalName", 200),
    shortName: str(formData, "shortName", 100),
    tagline: str(formData, "tagline", 300),
    presentation: longStr(formData, "presentation", 3000),
    addressLine1: str(formData, "addressLine1", 200),
    addressLine2: str(formData, "addressLine2", 200),
    addressLine3: str(formData, "addressLine3", 200),
    phone: str(formData, "phone", 50),
    phoneSecondary: str(formData, "phoneSecondary", 50),
    phoneEmergency: str(formData, "phoneEmergency", 50),
    email: str(formData, "email", 160),
    emailSecondary: str(formData, "emailSecondary", 160),
    emailEconomat: str(formData, "emailEconomat", 160),
    ifu: str(formData, "ifu", 40),
    ifuIssueDate: str(formData, "ifuIssueDate", 80),
    webTv: str(formData, "webTv", 120),
    website: str(formData, "website", 200),
    websiteSecondary: str(formData, "websiteSecondary", 200),
    facebook: str(formData, "facebook", 200),
    whatsapp: str(formData, "whatsapp", 200),
    mapCoordinates: str(formData, "mapCoordinates", 60),
    plusCode: str(formData, "plusCode", 120),
    populationBasin: str(formData, "populationBasin", 200),
    mapEmbed: str(formData, "mapEmbed", 500),
    mapLink: str(formData, "mapLink", 500),
    openingHours: str(formData, "openingHours", 150),
    emergencyHours: str(formData, "emergencyHours", 150),
    saturdayHours: str(formData, "saturdayHours", 150),
    beds: str(formData, "beds", 50),
    staffCount: str(formData, "staffCount", 50),
    founded: str(formData, "founded", 20),
    donationMethods: methods,
    archiveRetentionMonths: int(formData, "archiveRetentionMonths", 24),
    contactChannels,
    socialLinks,
    webLinks,
    staffStats,
    developerName: str(formData, "developerName", 120),
    developerRole: str(formData, "developerRole", 120),
    developerEmail: str(formData, "developerEmail", 160),
    developerPhone: str(formData, "developerPhone", 60),
    developerNote: longStr(formData, "developerNote", 800),
  });

  revalidatePath("/", "layout");
  revalidatePath("/admin/parametres");
}
