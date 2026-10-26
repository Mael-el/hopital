import { desc } from "drizzle-orm";

import { AdminHeader, EmptyState } from "@/components/admin/ui";
import { Icon } from "@/components/icons";
import { db } from "@/db";
import { archives } from "@/db/schema";
import { runArchival } from "@/lib/archive";
import { requireUser } from "@/lib/auth";
import { formatDateTime } from "@/lib/format";
import { runArchiveNow } from "../actions";

export const dynamic = "force-dynamic";

const TYPE_LABELS: Record<string, string> = {
  consultation_request: "Demande de consultation",
  donation: "Don",
  contact_message: "Message de contact",
  service: "Service",
  doctor: "Praticien",
  news: "Actualité",
  faq: "Question fréquente",
  donation_need: "Besoin de don",
};

export default async function AdminArchivesPage() {
  await requireUser(["admin", "requests"]);
  await runArchival();

  const items = await db.select().from(archives).orderBy(desc(archives.archivedAt));

  const byType = items.reduce<Record<string, number>>((acc, item) => {
    acc[item.entityType] = (acc[item.entityType] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <AdminHeader
        title="Archives"
        description="Données inactives depuis plus de 30 jours : elles quittent les listes actives mais restent consultables ici."
        action={
          <form action={runArchiveNow}>
            <button type="submit" className="btn btn-primary">
              <Icon name="shield" className="h-4 w-4" />
              Lancer l&apos;archivage
            </button>
          </form>
        }
      />

      {Object.keys(byType).length > 0 && (
        <div className="mb-6 flex flex-wrap gap-3">
          {Object.entries(byType).map(([type, count]) => (
            <span key={type} className="badge bg-white text-slate-700 ">
              {TYPE_LABELS[type] ?? type} : {count}
            </span>
          ))}
        </div>
      )}

      {items.length === 0 ? (
        <EmptyState
          title="Archive vide"
          text="Aucune donnée n'a encore été archivée. L'archivage automatique s'exécute à chaque ouverture du tableau de bord."
          icon="book"
        />
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <details
              key={item.id}
              className="rounded-[3px] border border-slate-200 bg-white p-5"
            >
              <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-800">{item.label}</p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {TYPE_LABELS[item.entityType] ?? item.entityType} · archivée le{" "}
                    {formatDateTime(item.archivedAt)}
                    {item.retentionUntil &&
                      ` · conservée jusqu'au ${formatDateTime(item.retentionUntil)}`}
                  </p>
                </div>
                <span className="badge bg-slate-100 text-slate-600">
                  <Icon name="book" className="h-3 w-3" />
                  Lecture seule
                </span>
              </summary>
              <pre className="mt-4 overflow-x-auto rounded-[3px] bg-slate-900 p-4 text-xs leading-relaxed text-slate-100">
                {JSON.stringify(item.payload, null, 2)}
              </pre>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}
