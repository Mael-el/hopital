"use client";

export async function fetchCsrfToken(): Promise<string> {
  const response = await fetch("/api/csrf", {
    credentials: "same-origin",
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Impossible de récupérer le jeton de sécurité.");
  const data = (await response.json()) as { token: string };
  return data.token;
}

export async function postJson<T>(
  url: string,
  payload: Record<string, unknown>,
): Promise<{ status: number; data: T }> {
  const token = await fetchCsrfToken();
  const response = await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: {
"Content-Type": "application/json",
"x-csrf-token": token,
    },
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as T;
  return { status: response.status, data };
}
