import { randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const CSRF_COOKIE = "lacroix_csrf";
export const CSRF_HEADER = "x-csrf-token";

export function newCsrfToken(): string {
  return randomBytes(24).toString("hex");
}

/**
 * Compare deux jetons de façon à temps constant.
 * Renvoie false si l'un des deux est absent ou mal formé.
 */
export function safeEqual(a: string | null | undefined, b: string | null | undefined) {
  if (!a || !b) return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

/**
 * Vérifie le jeton CSRF (double submit) d'une requête entrante.
 * Le jeton doit être présent dans le cookie ET dans l'en-tête de requête.
 */
export async function verifyCsrfRequest(req: Request): Promise<boolean> {
  const store = await cookies();
  const cookieToken = store.get(CSRF_COOKIE)?.value ?? null;
  const headerToken = req.headers.get(CSRF_HEADER);
  return safeEqual(cookieToken, headerToken);
}

/** Vérifie un jeton fourni par un formulaire (cookie + champ caché). */
export async function verifyCsrfField(token: string | null): Promise<boolean> {
  const store = await cookies();
  const cookieToken = store.get(CSRF_COOKIE)?.value ?? null;
  return safeEqual(cookieToken, token);
}
