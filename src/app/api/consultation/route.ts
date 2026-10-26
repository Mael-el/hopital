import { randomBytes } from "node:crypto";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { consultationRequests, services } from "@/db/schema";
import { verifyCsrfRequest } from "@/lib/csrf";
import { notifyNewConsultationRequest } from "@/lib/mail";
import {
  isValidDateInput,
  isValidPhone,
  sanitizeMultiline,
  sanitizeText,
} from "@/lib/validation";

export const dynamic = "force-dynamic";

function reference(): string {
  const year = new Date().getFullYear();
  return `DEM-${year}-${randomBytes(3).toString("hex").toUpperCase()}`;
}

export async function POST(req: Request) {
  if (!(await verifyCsrfRequest(req))) {
    return NextResponse.json(
      { error: "Session de sécurité expirée. Veuillez recharger la page." },
      { status: 403 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const fullName = sanitizeText(body.fullName, 120);
  const phone = sanitizeText(body.phone, 40);
  const serviceSlug = sanitizeText(body.serviceSlug, 80);
  const preferredDate = sanitizeText(body.preferredDate, 20);
  const reason = sanitizeMultiline(body.reason, 2000);

  const errors: Record<string, string> = {};
  if (fullName.length < 2) errors.fullName = "Merci d'indiquer votre nom complet.";
  if (!isValidPhone(phone)) errors.phone = "Numéro de téléphone invalide.";
  if (!serviceSlug) errors.serviceSlug = "Merci de choisir un service.";
  if (reason.length < 5)
    errors.reason = "Merci de préciser le motif de votre demande.";
  if (preferredDate && !isValidDateInput(preferredDate))
    errors.preferredDate = "Date invalide.";

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 422 });
  }

  const serviceRows = await db
    .select()
    .from(services)
    .where(eq(services.slug, serviceSlug))
    .limit(1);

  const service = serviceRows[0];
  if (!service || !service.published) {
    return NextResponse.json(
      { errors: { serviceSlug: "Ce service n'est pas disponible." } },
      { status: 422 },
    );
  }

  const ref = reference();

  await db.insert(consultationRequests).values({
    reference: ref,
    fullName,
    phone,
    serviceId: service.id,
    serviceLabel: service.name,
    preferredDate: preferredDate || null,
    reason,
    status: "pending",
  });

  try {
    await notifyNewConsultationRequest({
      reference: ref,
      fullName,
      phone,
      serviceLabel: service.name,
      preferredDate: preferredDate || null,
      reason,
    });
  } catch (error) {
    console.error("Notification e-mail :", error);
  }

  return NextResponse.json({
    ok: true,
    reference: ref,
    message:
      "Votre demande a bien été transmise. L'hôpital vous rappellera pour fixer le rendez-vous.",
  });
}
