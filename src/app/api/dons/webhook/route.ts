import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { donations } from "@/db/schema";
import { fetchFedaPayTransaction, isFedapayConfigured } from "@/lib/fedapay";

export const dynamic = "force-dynamic";

function normalizeStatus(status: unknown): "success" | "failed" | "pending" {
  const value = String(status ?? "").toLowerCase();
  if (["successful", "success", "paid", "complete", "completed"].includes(value))
    return "success";
  if (["failed", "failure", "canceled", "cancelled", "expired"].includes(value))
    return "failed";
  return "pending";
}

export async function POST(req: Request) {
  let payload: Record<string, unknown> = {};
  try {
    payload = (await req.json()) as Record<string, unknown>;
  } catch {
    payload = {};
  }

  const source =
    (payload.transaction as Record<string, unknown> | undefined) ??
    (payload.data as Record<string, unknown> | undefined) ??
    payload;

  const rawId = source.id ?? source.transaction_id ?? payload.id;
  const transactionId = rawId ? String(rawId) : null;

  if (!transactionId) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  let status = normalizeStatus(source.status ?? payload.status);

  /* Vérification côté serveur auprès de FedaPay (source de vérité). */
  if (isFedapayConfigured()) {
    const transaction = await fetchFedaPayTransaction(transactionId);
    if (transaction?.status) {
      status = normalizeStatus(transaction.status);
    }
  }

  const rows = await db
    .select()
    .from(donations)
    .where(eq(donations.fedapayTransactionId, transactionId))
    .limit(1);

  const donation = rows[0];
  if (!donation) {
    return NextResponse.json({ ok: false, reason: "don introuvable" });
  }

  await db
    .update(donations)
    .set({ status, updatedAt: new Date(), lastActivityAt: new Date() })
    .where(eq(donations.id, donation.id));

  return NextResponse.json({ ok: true, status });
}
