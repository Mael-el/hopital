import { createHash, randomBytes } from "node:crypto";
import { and, eq, gt } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";

import { db } from "@/db";
import { sessions, users } from "@/db/schema";

export const SESSION_COOKIE = "lacroix_session";
export const SESSION_TTL_DAYS = 7;

export type Role = "admin" | "content" | "requests" | "developer";

export const ROLE_LABELS: Record<Role, string> = {
  admin: "Administrateur principal",
  content: "Gestionnaire de contenus",
  requests: "Gestionnaire demandes & dons",
  developer: "Développeur & maintenance technique",
};

/** Le développeur dispose du même périmètre que l'administrateur. */
export function hasFullAccess(role: Role): boolean {
  return role === "admin" || role === "developer";
}

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function createSession(userId: number): Promise<void> {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_TTL_DAYS * 86_400_000);

  await db.insert(sessions).values({ id: hashToken(token), userId, expiresAt });

  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_DAYS * 86_400,
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) {
    await db.delete(sessions).where(eq(sessions.id, hashToken(token)));
  }
  store.delete(SESSION_COOKIE);
}

export type SessionUser = {
  id: number;
  username: string;
  fullName: string;
  email: string;
  role: Role;
};

export async function getSessionUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const rows = await db
    .select({
      id: users.id,
      username: users.username,
      fullName: users.fullName,
      email: users.email,
      role: users.role,
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(
      and(
        eq(sessions.id, hashToken(token)),
        gt(sessions.expiresAt, new Date()),
        eq(users.active, true),
      ),
    )
    .limit(1);

  return rows[0] ?? null;
}

/** Protège une page / une action d'administration. */
export async function requireUser(allowed?: Role[]): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) {
    redirect("/admin/connexion");
  }
  if (allowed && allowed.length > 0) {
    if (!hasFullAccess(user.role) && !allowed.includes(user.role)) {
      redirect("/admin?acces=refuse");
    }
  }
  return user;
}

/** Variante pour les actions serveur : lève une erreur au lieu de rediriger. */
export async function assertUser(allowed?: Role[]): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("Session expirée. Veuillez vous reconnecter.");
  }
  if (allowed && allowed.length > 0 && !hasFullAccess(user.role)) {
    if (!allowed.includes(user.role)) {
      throw new Error("Vous n'avez pas les droits pour cette action.");
    }
  }
  return user;
}

export async function authenticate(
  username: string,
  password: string,
): Promise<SessionUser | null> {
  const rows = await db
    .select()
    .from(users)
    .where(eq(users.username, username.trim().toLowerCase()))
    .limit(1);

  const user = rows[0];
  if (!user || !user.active) return null;

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) return null;

  return {
    id: user.id,
    username: user.username,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
  };
}
