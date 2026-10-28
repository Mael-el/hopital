import Link from "next/link";
import type { ReactNode } from "react";
import { and, eq, sql } from "drizzle-orm";

import { AdminNav, type AdminNavItem } from "@/components/admin/admin-nav";
import { Icon } from "@/components/icons";
import { db } from "@/db";
import { contactMessages, consultationRequests } from "@/db/schema";
import { getSessionUser, ROLE_LABELS } from "@/lib/auth";
import { logoutAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await getSessionUser();

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
        {children}
      </div>
    );
  }

  const [pendingRequests] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(consultationRequests)
    .where(eq(consultationRequests.status, "pending"));

  const [unreadMessages] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(contactMessages)
    .where(eq(contactMessages.status, "new"));

  const nav: AdminNavItem[] = [
    { href: "/admin", label: "Tableau de bord", icon: "activity" },
    { href: "/admin/contenus/accueil", label: "Contenu · Accueil", icon: "building" },
    { href: "/admin/contenus/a-propos", label: "Contenu · À propos", icon: "book" },
    { href: "/admin/services", label: "Services", icon: "hospital" },
    { href: "/admin/medecins", label: "Médecins", icon: "users" },
    { href: "/admin/actualites", label: "Actualités", icon: "sparkles" },
    { href: "/admin/faq", label: "FAQ", icon: "tag" },
    {
      href: "/admin/demandes",
      label: "Demandes de consultation",
      icon: "calendar",
      badge: pendingRequests?.count ?? 0,
    },
    { href: "/admin/dons", label: "Dons", icon: "hand-heart" },
    {
      href: "/admin/messages",
      label: "Messages",
      icon: "mail",
      badge: unreadMessages?.count ?? 0,
    },
    { href: "/admin/archives", label: "Archives", icon: "book" },
    { href: "/admin/parametres", label: "Paramètres", icon: "shield" },
  ];

  return (
    <div className="admin-shell min-h-screen">
      <header className="admin-topbar sticky top-0 z-40 border-b border-brand-100">
        <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/admin" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-700 text-white">
              <Icon name="cross" className="h-5 w-5" strokeWidth={2} />
            </span>
            <span className="hidden leading-tight sm:block">
              <span className="block text-sm font-bold text-brand-900">
                Espace administration
              </span>
              <span className="block text-xs text-slate-500">
                Hôpital La Croix de Zinvié
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden text-sm font-medium text-slate-600 hover:text-brand-700 sm:inline"
            >
              Voir le site
            </Link>
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-800">
                {user.fullName}
              </p>
              <p className="text-xs text-slate-500">{ROLE_LABELS[user.role]}</p>
            </div>
            <form action={logoutAction}>
              <button type="submit" className="btn btn-ghost">
                <Icon name="close" className="h-4 w-4" />
                Déconnexion
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[100rem] flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row">
        <aside className="lg:w-64 lg:shrink-0">
          <div className="admin-sidebar-card rounded-xl p-3">
            <AdminNav items={nav} />
          </div>
          <p className="mt-4 hidden rounded-lg bg-brand-50 p-4 text-xs leading-relaxed text-brand-800 lg:block">
            <strong className="block">Archivage automatique</strong>
            Les demandes, dons et messages inactifs depuis plus de 30 jours sont
            automatiquement déplacés vers les archives.
          </p>
        </aside>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
