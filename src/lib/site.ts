/** Adresse publique du site (surchargeable via NEXT_PUBLIC_SITE_URL). */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://hlacroix-zinvie.net"
).replace(/\/$/, "");
