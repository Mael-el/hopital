import { cookies } from "next/headers";
import { CSRF_COOKIE, newCsrfToken } from "@/lib/csrf";

export const dynamic = "force-dynamic";

export async function GET() {
  const store = await cookies();
  let token = store.get(CSRF_COOKIE)?.value;

  if (!token) {
    token = newCsrfToken();
    store.set(CSRF_COOKIE, token, {
      httpOnly: false,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 8,
    });
  }

  return Response.json({ token });
}
