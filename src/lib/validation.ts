export type FieldErrors = Record<string, string>;

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

/** Normalise un numéro de téléphone béninois / ouest-africain. */
export function normalizePhone(value: string): string {
  const digits = value.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) {
    return "+" + digits.slice(1).replace(/^229/, "").replace(/\s+/g, "");
  }
  const local = digits.replace(/\s+/g, "");
  if (local.startsWith("00229")) return "+" + local.slice(5);
  if (local.startsWith("229")) return "+" + local.slice(3);
  return local;
}

export function isValidPhone(value: string): boolean {
  const normalized = normalizePhone(value).replace(/\D/g, "");
  return normalized.length >= 8 && normalized.length <= 15;
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

export function isValidDateInput(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime());
}

export function sanitizeText(value: unknown, maxLength = 4000): string {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim().slice(0, maxLength);
}

export function sanitizeMultiline(value: unknown, maxLength = 8000): string {
  if (typeof value !== "string") return "";
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim().slice(0, maxLength);
}
