import Link from "next/link";
import { desc, eq, sql } from "drizzle-orm";

import { StatCard, StatusBadge } from "@/components/admin/ui";
import { Icon } from "@/components/icons";
import { db } from "@/db";
import {
  archives,
  contactMessages,
  consultationRequests,
  donations,
  news,
} from "@/db/schema";
import { runArchival } from "@/lib/archive";
import { requireUser } from "@/lib/auth";
import { formatDateTime, formatFcfa } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const user = await requireUser();

  /* Archivage automatique des données inactives depuis plus de 30 jours. */
  const report = await runArchival();

  const [pendingRequests] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(consultationRequests)
    .where(eq(consultationRequests.status, "pending"));

  const [unreadMessages] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(contactMessages)
    .where(eq(contactMessages.status, "new"));

  const [donTotals] = await db
    .select({
      count: sql<number>`count(*)::int`,
      total: sql<number>`coalesce(sum(amount), 0)::int`,
    })
    .from(donations)
    .where(eq(donations.status, "success"));

  const [archiveCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(archives);

  const [publishedNews] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(news)
    .where(eq(news.published, true));

  const recentRequests = await db
    .select()
    .from(consultationRequests)
    .orderBy(desc(consultationRequests.createdAt))
    .limit(5);

  const recentDonations = await db
    .select()
    .from(donations)
    .orderBy(desc(donations.createdAt))
    .limit(5);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Tableau de bord
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Bonjour {user.fullName}. Voici l&apos;activité récente de l&apos;hôpital.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/demandes" className="btn btn-ghost">
            <Icon name="calendar" className="h-4 w-4" />
            Demandes
          </Link>
          <Link href="/admin/dons" className="btn btn-ghost">
            <Icon name="hand-heart" className="h-4 w-4" />
            Dons
          </Link>
          <Link href="/admin/messages" className="btn btn-ghost">
            <Icon name="mail" className="h-4 w-4" />
            Messages
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Demandes en attente"
          value={pendingRequests?.count ?? 0}
          icon="calendar"
          href="/admin/demandes"
          hint="À rappeler"
        />
        <StatCard
          label="Messages non lus"
          value={unreadMessages?.count ?? 0}
          icon="mail"
          href="/admin/messages"
          hint="Formulaire de contact"
        />
        <StatCard
          label="Dons confirmés"
          value={donTotals?.count ?? 0}
          icon="hand-heart"
          href="/admin/dons"
          hint={formatFcfa(donTotals?.total ?? 0)}
        />
        <StatCard
          label="Actualités publiées"
          value={publishedNews?.count ?? 0}
          icon="sparkles"
          href="/admin/actualites"
          hint="Sur la page d'accueil"
        />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Données archivées"
          value={archiveCount?.count ?? 0}
          icon="book"
          href="/admin/archives"
          hint="Inactives depuis + de 30 jours"
        />
        <StatCard
          label="Archivage automatique"
          value={`${report.archived}`}
          icon="shield"
          hint="Dernier passage de l'archivage"
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-[3px] border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <h2 className="font-bold text-slate-800">Dernières demandes</h2>
            <Link
              href="/admin/demandes"
              className="text-sm font-semibold text-brand-700 hover:underline"
            >
              Tout voir
            </Link>
          </div>
          {recentRequests.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-slate-500">
              Aucune demande pour le moment.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {recentRequests.map((request) => (
                <li key={request.id} className="px-5 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-800">
                        {request.fullName}
                      </p>
                      <p className="truncate text-sm text-slate-600">
                        {request.serviceLabel} · {request.phone}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {formatDateTime(request.createdAt)}
                      </p>
                    </div>
                    <StatusBadge status={request.status} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-[3px] border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <h2 className="font-bold text-slate-800">Derniers dons</h2>
            <Link
              href="/admin/dons"
              className="text-sm font-semibold text-brand-700 hover:underline"
            >
              Tout voir
            </Link>
          </div>
          {recentDonations.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-slate-500">
              Aucun don enregistré.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {recentDonations.map((donation) => (
                <li key={donation.id} className="px-5 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-800">
                        {donation.donorName || "Donateur anonyme"}
                      </p>
                      <p className="truncate text-sm text-slate-600">
                        {formatFcfa(donation.amount)} · {donation.reference}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {formatDateTime(donation.createdAt)}
                      </p>
                    </div>
                    <StatusBadge status={donation.status} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="mt-6 rounded-[3px] border border-slate-200 bg-white p-5">
        <h2 className="font-bold text-slate-800">Raccourcis</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { href: "/admin/contenus/accueil", label: "Modifier l'accueil", icon: "building" as const },
            { href: "/admin/services", label: "Gérer les services", icon: "hospital" as const },
            { href: "/admin/medecins", label: "Gérer les médecins", icon: "users" as const },
            { href: "/admin/actualites", label: "Publier une actualité", icon: "sparkles" as const },
            { href: "/admin/faq", label: "Mettre à jour la FAQ", icon: "tag" as const },
            { href: "/admin/archives", label: "Consulter les archives", icon: "book" as const },
            { href: "/admin/parametres", label: "Coordonnées & dons", icon: "shield" as const },
            { href: "/admin/demandes", label: "Traiter les demandes", icon: "calendar" as const },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-[3px] border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-800"
            >
              <Icon name={item.icon} className="h-4 w-4 text-brand-600" />
              {item.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
