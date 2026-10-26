import { desc } from "drizzle-orm";

import {
  AdminHeader,
  EmptyState,
  StatusBadge,
  TextArea,
} from "@/components/admin/ui";
import { Icon } from "@/components/icons";
import { db } from "@/db";
import { consultationRequests } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { formatDateTime, formatDateShort } from "@/lib/format";
import { setRequestStatus } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminRequestsPage() {
  await requireUser(["admin", "requests"]);

  const requests = await db
    .select()
    .from(consultationRequests)
    .orderBy(desc(consultationRequests.createdAt));

  return (
    <div>
      <AdminHeader
        title="Demandes de consultation"
        description="Consultez les demandes envoyées par les patients, marquez-les comme traitées et ajoutez une note interne."
      />

      {requests.length === 0 ? (
        <EmptyState
          title="Aucune demande"
          text="Les demandes envoyées depuis le site apparaîtront ici."
          icon="calendar"
        />
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <article
              key={request.id}
              className="rounded-[3px] border border-slate-200 bg-white p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-lg font-bold text-slate-900">
                      {request.fullName}
                    </h2>
                    <StatusBadge status={request.status} />
                  </div>
                  <p className="mt-1 text-xs text-slate-400">
                    Référence {request.reference} · reçue le{" "}
                    {formatDateTime(request.createdAt)}
                  </p>
                </div>
                <a
                  href={`tel:${request.phone.replace(/\s/g, "")}`}
                  className="btn btn-primary"
                >
                  <Icon name="phone" className="h-4 w-4" />
                  {request.phone}
                </a>
              </div>

              <dl className="mt-4 grid gap-4 sm:grid-cols-3">
                <div>
                  <dt className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Service souhaité
                  </dt>
                  <dd className="mt-1 font-medium text-slate-800">
                    {request.serviceLabel}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Date préférée
                  </dt>
                  <dd className="mt-1 font-medium text-slate-800">
                    {request.preferredDate
                      ? formatDateShort(request.preferredDate)
                      : "Non précisée"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Motif
                  </dt>
                  <dd className="mt-1 text-sm text-slate-700">{request.reason}</dd>
                </div>
              </dl>

              <form
                action={setRequestStatus}
                className="mt-4 grid gap-3 rounded-[3px] bg-slate-50 p-4 sm:grid-cols-[180px_1fr_auto] sm:items-end"
              >
                <input type="hidden" name="id" value={request.id} />
                <div>
                  <label htmlFor={`status-${request.id}`} className="field-label">
                    Statut
                  </label>
                  <select
                    id={`status-${request.id}`}
                    name="status"
                    defaultValue={request.status}
                    className="field-input"
                  >
                    <option value="pending">En attente</option>
                    <option value="processed">Traitée</option>
                  </select>
                </div>
                <div>
                  <label htmlFor={`note-${request.id}`} className="field-label">
                    Note interne
                  </label>
                  <input
                    id={`note-${request.id}`}
                    name="adminNote"
                    defaultValue={request.adminNote}
                    placeholder="Ex. Rappel effectué le 03/02, RDV fixé…"
                    className="field-input"
                  />
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
