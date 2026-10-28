import { and, eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { news, pageViews, services } from "@/db/schema";
import { beninDate } from "@/lib/analytics";

export const dynamic = "force-dynamic";

const STATIC_PUBLIC_PATHS = new Set([
  "/",
  "/a-propos",
  "/services",
  "/medecins",
  "/consultation",
  "/dons",
  "/dons/merci",
  "/actualites",
  "/faq",
  "/contact",
  "/triage",
  "/fiche-imprimable",
]);

async function isPublishedPage(path: string): Promise<boolean> {
  if (STATIC_PUBLIC_PATHS.has(path)) return true;

  const serviceMatch = path.match(/^\/services\/([a-z0-9]+(?:-[a-z0-9]+)*)$/);
  if (serviceMatch) {
    const [service] = await db
      .select({ id: services.id })
      .from(services)
      .where(and(eq(services.slug, serviceMatch[1]), eq(services.published, true)))
      .limit(1);
    return Boolean(service);
  }

  const newsMatch = path.match(/^\/actualites\/([a-z0-9]+(?:-[a-z0-9]+)*)$/);
  if (newsMatch) {
    const [article] = await db
      .select({ id: news.id })
      .from(news)
      .where(and(eq(news.slug, newsMatch[1]), eq(news.published, true)))
      .limit(1);
    return Boolean(article);
  }

  return false;
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 256) {
    return NextResponse.json({ error: "Requête trop volumineuse." }, { status: 413 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  if (
    !body ||
    typeof body !== "object" ||
    !("path" in body) ||
    typeof body.path !== "string" ||
    body.path.length > 200 ||
    !body.path.startsWith("/") ||
    body.path.includes("?") ||
    body.path.includes("#")
  ) {
    return NextResponse.json({ error: "Page invalide." }, { status: 400 });
  }

  if (!(await isPublishedPage(body.path))) {
    return NextResponse.json({ error: "Page publique introuvable." }, { status: 404 });
  }

  const day = beninDate();
  await db
    .insert(pageViews)
    .values({ day, path: body.path, views: 1 })
    .onConflictDoUpdate({
      target: [pageViews.day, pageViews.path],
      set: { views: sql`${pageViews.views} + 1` },
    });

  return new Response(null, { status: 204 });
}
