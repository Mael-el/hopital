import { sql } from "drizzle-orm";
import {
  boolean,
  date,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

/* ------------------------------------------------------------------ */
/* Rôles et statuts                                                    */
/* ------------------------------------------------------------------ */

export const userRole = pgEnum("user_role", [
  "admin",
  "content",
  "requests",
  "developer",
]);
export const requestStatus = pgEnum("request_status", ["pending", "processed"]);
export const donationStatus = pgEnum("donation_status", [
"pending",
"success",
"failed",
]);
export const messageStatus = pgEnum("message_status", ["new", "read", "processed"]);

/* ------------------------------------------------------------------ */
/* Authentification                                                     */
/* ------------------------------------------------------------------ */

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  passwordHash: text("password_hash").notNull(),
  role: userRole("role").notNull().default("content"),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const sessions = pgTable(
"sessions",
  {
    id: text("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("sessions_user_idx").on(t.userId)],
);

export const pageViews = pgTable(
  "page_views",
  {
    day: date("day").notNull(),
    path: text("path").notNull(),
    views: integer("views").notNull().default(0),
  },
  (t) => [primaryKey({ columns: [t.day, t.path] })],
);

/* ------------------------------------------------------------------ */
/* Contenus éditables                                                   */
/* ------------------------------------------------------------------ */

export const pages = pgTable("pages", {
  slug: text("slug").primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle").notNull().default(""),
  body: text("body").notNull().default(""),
  data: jsonb("data")
    .$type<Record<string, unknown>>()
    .notNull()
    .default(sql`'{}'::jsonb`),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const services = pgTable(
"services",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    category: text("category").notNull().default("principal"),
    shortDescription: text("short_description").notNull(),
    description: text("description").notNull(),
    hours: text("hours").notNull(),
    location: text("location").notNull().default(""),
    headName: text("head_name").notNull().default(""),
    icon: text("icon").notNull().default("stethoscope"),
    appointment: boolean("appointment").notNull().default(false),
    order: integer("sort_order").notNull().default(0),
    published: boolean("published").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    lastActivityAt: timestamp("last_activity_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("services_published_idx").on(t.published)],
);

export const doctors = pgTable(
"doctors",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    kind: text("kind").notNull().default("medecin"),
    specialty: text("specialty").notNull(),
    serviceId: integer("service_id").references(() => services.id, {
      onDelete: "set null",
    }),
    role: text("role").notNull().default(""),
    days: text("days").notNull().default(""),
    hours: text("hours").notNull().default(""),
    bio: text("bio").notNull().default(""),
    order: integer("sort_order").notNull().default(0),
    published: boolean("published").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    lastActivityAt: timestamp("last_activity_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("doctors_service_idx").on(t.serviceId)],
);

export const news = pgTable(
"news",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    excerpt: text("excerpt").notNull(),
    content: text("content").notNull(),
    category: text("category").notNull().default("Actualité"),
    author: text("author").notNull().default("Hôpital La Croix de Zinvié"),
    coverImage: text("cover_image").notNull().default(""),
    published: boolean("published").notNull().default(true),
    publishedAt: timestamp("published_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    lastActivityAt: timestamp("last_activity_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("news_published_idx").on(t.published)],
);

export const faqs = pgTable(
"faqs",
  {
    id: serial("id").primaryKey(),
    question: text("question").notNull(),
    answer: text("answer").notNull(),
    category: text("category").notNull().default("Général"),
    order: integer("sort_order").notNull().default(0),
    published: boolean("published").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    lastActivityAt: timestamp("last_activity_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("faqs_published_idx").on(t.published)],
);

export const timelineEntries = pgTable("timeline_entries", {
  id: serial("id").primaryKey(),
  year: text("year").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  order: integer("sort_order").notNull().default(0),
});

export const hospitalValues = pgTable("hospital_values", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull().default("heart"),
  order: integer("sort_order").notNull().default(0),
});

export const donationNeeds = pgTable("donation_needs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull().default("cross"),
  targetAmount: integer("target_amount").notNull().default(0),
  order: integer("sort_order").notNull().default(0),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  lastActivityAt: timestamp("last_activity_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/* ------------------------------------------------------------------ */
/* Données non publiques                                                */
/* ------------------------------------------------------------------ */

export const consultationRequests = pgTable(
"consultation_requests",
  {
    id: serial("id").primaryKey(),
    reference: text("reference").notNull().unique(),
    fullName: text("full_name").notNull(),
    phone: text("phone").notNull(),
    serviceId: integer("service_id").references(() => services.id, {
      onDelete: "set null",
    }),
    serviceLabel: text("service_label").notNull(),
    preferredDate: date("preferred_date"),
    reason: text("reason").notNull(),
    status: requestStatus("status").notNull().default("pending"),
    adminNote: text("admin_note").notNull().default(""),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    lastActivityAt: timestamp("last_activity_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("requests_status_idx").on(t.status)],
);

export const donations = pgTable(
"donations",
  {
    id: serial("id").primaryKey(),
    reference: text("reference").notNull().unique(),
    donorName: text("donor_name").notNull().default(""),
    donorEmail: text("donor_email").notNull().default(""),
    donorPhone: text("donor_phone").notNull().default(""),
    amount: integer("amount").notNull(),
    currency: text("currency").notNull().default("XOF"),
    method: text("method").notNull().default("fedapay"),
    purpose: text("purpose").notNull().default(""),
    message: text("message").notNull().default(""),
    status: donationStatus("status").notNull().default("pending"),
    fedapayTransactionId: text("fedapay_transaction_id"),
    paymentUrl: text("payment_url"),
    receiptSent: boolean("receipt_sent").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    lastActivityAt: timestamp("last_activity_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("donations_status_idx").on(t.status)],
);

export const contactMessages = pgTable(
"contact_messages",
  {
    id: serial("id").primaryKey(),
    fullName: text("full_name").notNull(),
    email: text("email").notNull(),
    phone: text("phone").notNull().default(""),
    subject: text("subject").notNull(),
    message: text("message").notNull(),
    status: messageStatus("status").notNull().default("new"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    lastActivityAt: timestamp("last_activity_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("messages_status_idx").on(t.status)],
);

/* ------------------------------------------------------------------ */
/* Archives (données inactives depuis plus de 30 jours)                 */
/* ------------------------------------------------------------------ */

export const archives = pgTable(
"archives",
  {
    id: serial("id").primaryKey(),
    entityType: text("entity_type").notNull(),
    entityId: integer("entity_id").notNull(),
    label: text("label").notNull(),
    payload: jsonb("payload").$type<Record<string, unknown>>().notNull(),
    archivedAt: timestamp("archived_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    retentionUntil: timestamp("retention_until", { withTimezone: true }),
  },
  (t) => [index("archives_type_idx").on(t.entityType)],
);

/* ------------------------------------------------------------------ */
/* Paramètres généraux du site                                          */
/* ------------------------------------------------------------------ */

export const siteSettings = pgTable("site_settings", {
  key: text("key").primaryKey(),
  value: jsonb("value").$type<Record<string, unknown>>().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type User = typeof users.$inferSelect;
export type Service = typeof services.$inferSelect;
export type Doctor = typeof doctors.$inferSelect;
export type NewsItem = typeof news.$inferSelect;
export type Faq = typeof faqs.$inferSelect;
export type ConsultationRequest = typeof consultationRequests.$inferSelect;
export type Donation = typeof donations.$inferSelect;
export type ContactMessage = typeof contactMessages.$inferSelect;
export type Archive = typeof archives.$inferSelect;
