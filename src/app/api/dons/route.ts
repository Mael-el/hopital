import { randomBytes } from "node:crypto";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { donations } from "@/db/schema";
import { verifyCsrfRequest } from "@/lib/csrf";
import { notifyNewDonation } from "@/lib/mail";
import {
  createFedaPayTransaction,
  isFedapayConfigured,
} from "@/lib/fedapay";
import { isValidEmail, sanitizeMultiline, sanitizeText } from "@/lib/validation";

export const dynamic = "force-dynamic";

function reference(): string {
  const year = new Date().getFullYear();
  return `DON-${year}-${randomBytes(3).toString("hex").toUpperCase()}`;
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

  const amount = Number(body.amount);
  const donorName = sanitizeText(body.donorName, 120);
  const donorEmail = sanitizeText(body.donorEmail, 160);
  const donorPhone = sanitizeText(body.donorPhone, 40);
  const purpose = sanitizeText(body.purpose, 200);
  const message = sanitizeMultiline(body.message, 1000);

  const errors: Record<string, string> = {};
  if (!Number.isFinite(amount) || amount < 100)
    errors.amount = "Le montant minimum du don est de 100 FCFA.";
  if (amount > 20_000_000)
    errors.amount = "Le montant maximum par don est de 20 000 000 FCFA.";
  if (donorEmail && !isValidEmail(donorEmail))
    errors.donorEmail = "Adresse e-mail invalide.";

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 422 });
  }

  const ref = reference();
  const [row] = await db
    .insert(donations)
    .values({
      reference: ref,
      donorName,
      donorEmail,
      donorPhone,
      amount: Math.round(amount),
      currency: "XOF",
      method: "fedapay",
      purpose,
      message,
      status: "pending",
    })
    .returning();

  try {
    await notifyNewDonation({
      reference: ref,
      donorName,
      donorEmail,
      amount: Math.round(amount),
      purpose,
    });
  } catch (error) {
    console.error("Notification e-mail :", error);
  }

  /* ------------------------- FedaPay (si configuré) ---------------------- */
  if (isFedapayConfigured()) {
    try {
      const origin =
        req.headers.get("origin") ??
        `${req.headers.get("x-forwarded-proto") ?? "https"}://${
          req.headers.get("host") ?? "localhost"
        }`;

      const transaction = await createFedaPayTransaction({
        amount: Math.round(amount),
        description: `Don à l'Hôpital La Croix de Zinvié — ${ref}`,
        customer: {
          firstname: donorName || "Donateur",
          lastname: "",
          email: donorEmail || undefined,
          phone: donorPhone || undefined,
        },
        callbackUrl: `${origin}/dons/merci?ref=${ref}`,
      });

      await db
        .update(donations)
        .set({
          fedapayTransactionId: String(transaction.id),
          paymentUrl: transaction.url,
          updatedAt: new Date(),
        })
        .where(eq(donations.id, row.id));

      return NextResponse.json({
        ok: true,
        reference: ref,
        paymentUrl: transaction.url,
        mode: "fedapay",
      });
    } catch (error) {
      console.error("FedaPay :", error);
      await db
        .update(donations)
        .set({
          status: "failed",
          updatedAt: new Date(),
        })
        .where(eq(donations.id, row.id));

      return NextResponse.json(
        {
          error:
"Le service de paiement est momentanément indisponible. Merci de réessayer dans quelques instants.",
        },
        { status: 502 },
      );
    }
  }

  /* ----------------------- Mode démonstration (sandbox) -------------------- */
  return NextResponse.json({
    ok: true,
    reference: ref,
    paymentUrl: `/dons/merci?ref=${ref}&demo=1`,
    mode: "demo",
  });
}
