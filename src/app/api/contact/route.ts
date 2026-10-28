import { NextResponse } from "next/server";

import { db } from "@/db";
import { contactMessages } from "@/db/schema";
import { verifyCsrfRequest } from "@/lib/csrf";
import { notifyNewContactMessage } from "@/lib/mail";
import { isValidEmail, sanitizeMultiline, sanitizeText } from "@/lib/validation";

export const dynamic = "force-dynamic";

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
  const email = sanitizeText(body.email, 160);
  const phone = sanitizeText(body.phone, 40);
  const subject = sanitizeText(body.subject, 160);
  const message = sanitizeMultiline(body.message, 4000);

  const errors: Record<string, string> = {};
  if (fullName.length < 2) errors.fullName = "Merci d'indiquer votre nom.";
  if (!isValidEmail(email)) errors.email = "Adresse e-mail invalide.";
  if (subject.length < 2) errors.subject = "Merci d'indiquer un objet.";
  if (message.length < 5) errors.message = "Votre message est trop court.";

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 422 });
  }

  await db.insert(contactMessages).values({
    fullName,
    email,
    phone,
    subject,
    message,
    status: "new",
  });

  try {
    await notifyNewContactMessage({
      fullName,
      email,
      phone,
      subject,
      message,
    });
  } catch (error) {
    console.error("Notification e-mail :", error);
  }

  return NextResponse.json({
    ok: true,
    message:
      "Votre message a bien été envoyé. L'hôpital vous répondra dans les meilleurs délais.",
  });
}
