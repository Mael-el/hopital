/**
 * Client FedaPay — agrégateur béninois de paiement.
 * Documentation : https://docs.fedapay.com
 *
 * L'API secrete est uniquement lue côté serveur (jamais exposée au navigateur).
 * Si aucune clé n'est configurée, l'application fonctionne en « mode démonstration » :
 * les dons sont enregistrés et peuvent être confirmés manuellement par l'hôpital.
 */

const SANDBOX_BASE = "https://sandbox-api.fedapay.com/v1";
const LIVE_BASE = "https://api.fedapay.com/v1";

export function fedapayEnvironment(): "sandbox" | "live" {
  return process.env.FEDAPAY_ENV === "live" ? "live" : "sandbox";
}

export function fedapayBaseUrl(): string {
  return fedapayEnvironment() === "live" ? LIVE_BASE : SANDBOX_BASE;
}

export function isFedapayConfigured(): boolean {
  return Boolean(process.env.FEDAPAY_SECRET_KEY);
}

type CustomerInput = {
  firstname?: string;
  lastname?: string;
  email?: string;
  phone?: string;
};

export type FedaPayTransactionResult = {
  id: number;
  token: string;
  url: string;
};

function authHeaders(): Record<string, string> {
  return {
    Authorization: `Bearer ${process.env.FEDAPAY_SECRET_KEY}`,
"Content-Type": "application/json",
    Accept: "application/json",
  };
}

export async function createFedaPayTransaction(input: {
  amount: number;
  description: string;
  customer: CustomerInput;
  callbackUrl?: string;
}): Promise<FedaPayTransactionResult> {
  const base = fedapayBaseUrl();

  const body: Record<string, unknown> = {
    description: input.description,
    amount: input.amount,
    currency: { iso: "XOF" },
    customer: {
      firstname: input.customer.firstname || "Donateur",
      lastname: input.customer.lastname || "La Croix de Zinvié",
      email: input.customer.email || undefined,
      phone_number: input.customer.phone
        ? { number: input.customer.phone.replace(/^\+/, ""), country: "bj" }
        : undefined,
    },
  };

  if (input.callbackUrl) body.callback_url = input.callbackUrl;

  const createRes = await fetch(`${base}/transactions`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const created = (await createRes.json()) as {
    id?: number;
    message?: string;
    errors?: Record<string, string[]>;
  };

  if (!createRes.ok || !created.id) {
    const details =
      created.message ||
      Object.values(created.errors ?? {}).flat().join(" ") ||
"Erreur inconnue";
    throw new Error(`FedaPay : ${details}`);
  }

  const tokenRes = await fetch(`${base}/transactions/${created.id}/token`, {
    method: "POST",
    headers: authHeaders(),
    cache: "no-store",
  });

  const tokenData = (await tokenRes.json()) as {
    token?: string;
    url?: string;
    message?: string;
  };

  if (!tokenRes.ok || !tokenData.token) {
    throw new Error(
      `FedaPay : ${tokenData.message ?? "Impossible de générer le lien de paiement"}`,
    );
  }

  return {
    id: created.id,
    token: tokenData.token,
    url: tokenData.url ?? `${base}/transactions/${created.id}/token`,
  };
}

export async function fetchFedaPayTransaction(
  id: number | string,
): Promise<{ status?: string; amount?: number; [key: string]: unknown } | null> {
  if (!isFedapayConfigured()) return null;

  const res = await fetch(`${fedapayBaseUrl()}/transactions/${id}`, {
    method: "GET",
    headers: authHeaders(),
    cache: "no-store",
  });

  if (!res.ok) return null;
  const data = (await res.json()) as { status?: string; amount?: number };
  return data;
}
