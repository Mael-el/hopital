import { asc, gte } from "drizzle-orm";

import { AdminHeader, EmptyState, StatCard } from "@/components/admin/ui";
import { db } from "@/db";
import { pageViews } from "@/db/schema";
import { beninDate } from "@/lib/analytics";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

function formatDay(day: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Africa/Porto-Novo",
    day: "2-digit",
    month: "short",
  }).format(new Date(`${day}T12:00:00Z`));
}

function pageLabel(path: string): string {
  if (path === "/") return "Accueil";
  const labels: Record<string, string> = {
    "/a-propos": "À propos",
    "/services": "Services",
    "/medecins": "Médecins",
    "/consultation": "Consultation",
    "/dons": "Dons",
    "/dons/merci": "Remerciement après un don",
    "/actualites": "Actualités",
    "/faq": "FAQ",
    "/contact": "Contact",
    "/triage": "Orientation",
    "/fiche-imprimable": "Fiche imprimable",
  };
  if (labels[path]) return labels[path];

  const slug = path.split("/").at(-1) ?? path;
  const readableSlug = slug.replace(/-/g, " ");
  if (path.startsWith("/services/")) return `Service : ${readableSlug}`;
  if (path.startsWith("/actualites/")) return `Actualité : ${readableSlug}`;
  return path;
}

export default async function AdminAudiencePage() {
  await requireUser(["admin"]);

  const today = beninDate();
  const start = new Date(`${today}T00:00:00Z`);
  start.setUTCDate(start.getUTCDate() - 29);
  const startDay = start.toISOString().slice(0, 10);

  const rows = await db
    .select({ day: pageViews.day, path: pageViews.path, views: pageViews.views })
    .from(pageViews)
    .where(gte(pageViews.day, startDay))
    .orderBy(asc(pageViews.day));

  const dailyTotals = new Map<string, number>();
  const pageTotals = new Map<string, number>();
  for (const row of rows) {
    dailyTotals.set(row.day, (dailyTotals.get(row.day) ?? 0) + row.views);
    pageTotals.set(row.path, (pageTotals.get(row.path) ?? 0) + row.views);
  }

  const totalViews = rows.reduce((total, row) => total + row.views, 0);
  const todayViews = dailyTotals.get(today) ?? 0;
  const topPages = [...pageTotals.entries()]
    .map(([path, views]) => ({ path, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);
  const days = Array.from({ length: 30 }, (_, index) => {
    const date = new Date(`${startDay}T00:00:00Z`);
    date.setUTCDate(date.getUTCDate() + index);
    const day = date.toISOString().slice(0, 10);
    return { day, views: dailyTotals.get(day) ?? 0 };
  });
  const peakViews = Math.max(1, ...days.map((day) => day.views));

  return (
    <div>
      <AdminHeader
        title="Audience du site"
        description="Fréquentation des pages publiques au cours des 30 derniers jours."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Pages vues aujourd'hui" value={todayViews} icon="globe" />
        <StatCard label="Pages vues (30 jours)" value={totalViews} icon="activity" />
        <StatCard label="Pages consultées" value={pageTotals.size} icon="book" />
      </div>

      <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5 sm:p-6">
        <h2 className="font-bold text-slate-900">Visites par jour</h2>
        <p className="mt-1 text-sm text-slate-500">Pages vues, heure du Bénin.</p>

        {totalViews === 0 ? (
          <div className="mt-5">
            <EmptyState
              title="Pas encore de visites enregistrées"
              text="Les statistiques commenceront à apparaître après les prochaines visites du site."
              icon="globe"
            />
          </div>
        ) : (
          <div className="mt-5 space-y-2">
            {days.map(({ day, views }) => (
              <div key={day} className="grid grid-cols-[4.5rem_1fr_2.5rem] items-center gap-3">
                <span className="text-xs text-slate-500">{formatDay(day)}</span>
                <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-brand-600"
                    style={{ width: `${(views / peakViews) * 100}%` }}
                  />
                </div>
                <span className="text-right text-xs font-semibold text-slate-700">{views}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {topPages.length > 0 && (
        <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5 sm:p-6">
          <h2 className="font-bold text-slate-900">Pages les plus consultées</h2>
          <ol className="mt-4 divide-y divide-slate-100">
            {topPages.map(({ path, views }) => (
              <li key={path} className="flex items-center justify-between gap-4 py-3">
                <a
                  href={path}
                  target="_blank"
                  rel="noreferrer"
                  className="min-w-0 truncate text-sm font-medium text-brand-700 hover:underline"
                >
                  {pageLabel(path)}
                </a>
                <span className="shrink-0 text-sm font-semibold text-slate-700">
                  {views} {views === 1 ? "vue" : "vues"}
                </span>
              </li>
            ))}
          </ol>
        </section>
      )}

      <p className="mt-5 rounded-lg bg-brand-50 p-4 text-sm leading-relaxed text-brand-900">
        Ces chiffres comptent les pages vues, pas les personnes uniques. Aucun cookie,
        identifiant, adresse IP, paramètre d’URL ou contenu de formulaire n’est enregistré.
        Les visites de l’administration ne sont pas comptabilisées.
      </p>
    </div>
  );
}
