import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { donations } from "@/db/schema";
import { verifyCsrfRequest } from "@/lib/csrf";
import { isFedapayConfigured } from "@/lib/fedapay";

export const dynamic = "force-dynamic";

/**
 * Confirmation manuelle d'un don — réservée au mode démonstration
 * (aucune clé FedaPay configurée). En production, le statut du don est
 * uniquement mis à jour par le webhook FedaPay.
 */
export async function POST(req: Request) {
  if (isFedapayConfigured()) {
    return NextResponse.json(
      { error: "La confirmation manuelle est désactivée." },
      { status: 403 },
    );
  }

  if (!(await verifyCsrfRequest(req))) {
    return NextResponse.json(
      { error: "Session de sécurité expirée. Veuillez recharger la page." },
      { status: 403 },
    );
  }

  const body = (await req.json()) as { reference?: string };
  const reference = String(body.reference ?? "").trim();
  if (!reference) {
    return NextResponse.json({ error: "Référence manquante." }, { status: 400 });
  }

  const rows = await db
    .select()
    .from(donations)
    .where(eq(donations.reference, reference))
    .limit(1);

  const donation = rows[0];
  if (!donation) {
    return NextResponse.json({ error: "Don introuvable." }, { status: 404 });
  }

  await db
    .update(donations)
    .set({ status: "success", updatedAt: new Date(), lastActivityAt: new Date() })
    .where(eq(donations.id, donation.id));

  return NextResponse.json({ ok: true });
}
