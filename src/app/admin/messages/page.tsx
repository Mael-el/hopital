import { desc } from "drizzle-orm";

import { AdminHeader, EmptyState, StatusBadge } from "@/components/admin/ui";
import { Icon } from "@/components/icons";
import { db } from "@/db";
import { contactMessages } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { formatDateTime } from "@/lib/format";
import { setMessageStatus } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  await requireUser(["admin", "requests"]);

  const messages = await db
    .select()
    .from(contactMessages)
    .orderBy(desc(contactMessages.createdAt));

  return (
    <div>
      <AdminHeader
        title="Messages de contact"
        description="Traitez les messages reçus via le formulaire de contact : marquez-les comme lus ou traités."
      />

      {messages.length === 0 ? (
        <EmptyState
          title="Aucun message"
          text="Les messages du formulaire de contact apparaîtront ici."
          icon="mail"
        />
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <article
              key={message.id}
              className="rounded-lg border border-slate-200 bg-white p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-lg font-bold text-slate-900">
                      {message.subject}
                    </h2>
                    <StatusBadge status={message.status} />
                  </div>
                  <p className="mt-1 text-sm text-slate-600">
                    {message.fullName} ·{" "}
                    <a
                      href={`mailto:${message.email}`}
                      className="font-medium text-brand-700 hover:underline"
                    >
                      {message.email}
                    </a>
                    {message.phone && (
                      <>
                        {" · "}
                        <a
                          href={`tel:${message.phone.replace(/\s/g, "")}`}
                          className="font-medium text-brand-700 hover:underline"
                        >
                          {message.phone}
                        </a>
                      </>
                    )}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Reçu le {formatDateTime(message.createdAt)}
                  </p>
                </div>
                <a
                  href={`mailto:${message.email}?subject=RE:${encodeURIComponent(message.subject)}`}
                  className="btn btn-primary"
                >
                  <Icon name="mail" className="h-4 w-4" />
                  Répondre
                </a>
              </div>

              <p className="mt-4 whitespace-pre-line rounded-lg bg-sand-100 p-4 text-sm leading-relaxed text-slate-700">
                {message.message}
              </p>

              <form action={setMessageStatus} className="mt-4 flex flex-wrap items-end gap-3">
                <input type="hidden" name="id" value={message.id} />
                <div className="w-48">
                  <label htmlFor={`status-${message.id}`} className="field-label">
                    Statut
                  </label>
                  <select
                    id={`status-${message.id}`}
                    name="status"
                    defaultValue={message.status}
                    className="field-input"
                  >
                    <option value="new">Non lu</option>
                    <option value="read">Lu</option>
                    <option value="processed">Traité</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary">
                  <Icon name="check" className="h-4 w-4" />
                  Enregistrer
                </button>
              </form>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
