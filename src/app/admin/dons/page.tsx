import { desc } from "drizzle-orm";

import { AdminHeader, EmptyState, StatusBadge } from "@/components/admin/ui";
import { Icon } from "@/components/icons";
import { db } from "@/db";
import { donations } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { formatDateTime, formatFcfa } from "@/lib/format";
import { markReceiptSent, setDonationStatus } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminDonationsPage() {
  await requireUser(["admin", "requests"]);

  const all = await db
    .select()
    .from(donations)
    .orderBy(desc(donations.createdAt));

  const total = all
    .filter((donation) => donation.status === "success")
    .reduce((sum, donation) => sum + donation.amount, 0);

  return (
    <div>
      <AdminHeader
        title="Dons"
        description="Suivez les dons reçus via FedaPay : montant, statut, coordonnées du donateur et envoi du reçu."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Total collecté
          </p>
          <p className="mt-2 text-2xl font-bold text-brand-800">
            {formatFcfa(total)}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Nombre de dons
          </p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{all.length}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            En attente de confirmation
          </p>
          <p className="mt-2 text-2xl font-bold text-amber-700">
            {all.filter((donation) => donation.status === "pending").length}
          </p>
        </div>
      </div>

      {all.length === 0 ? (
        <EmptyState
          title="Aucun don"
          text="Les dons effectués sur le site apparaîtront ici."
          icon="hand-heart"
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Donateur</th>
                <th className="px-4 py-3">Montant</th>
                <th className="px-4 py-3">Affectation</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {all.map((donation) => (
                <tr key={donation.id} className="align-top">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-800">
                      {donation.donorName || "Donateur anonyme"}
                    </p>
                    {donation.donorEmail && (
                      <p className="mt-0.5 text-xs text-slate-500">
                        {donation.donorEmail}
                      </p>
                    )}
                    {donation.donorPhone && (
                      <p className="text-xs text-slate-500">{donation.donorPhone}</p>
                    )}
                    <p className="mt-1 text-xs text-slate-400">
                      {donation.reference}
                    </p>
                    {donation.message && (
                      <p className="mt-2 max-w-sm rounded-lg bg-sand-100 p-2 text-xs italic text-slate-600">
                        « {donation.message} »
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3 font-semibold text-brand-800">
                    {formatFcfa(donation.amount)}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600">
                    {donation.purpose || "Fonds libres"}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600">
                    {formatDateTime(donation.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={donation.status} />
                    {donation.receiptSent && (
                      <p className="mt-1 text-xs text-brand-700">Reçu envoyé</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col items-end gap-2">
                      <form
                        action={setDonationStatus}
                        className="flex items-center gap-2"
                      >
                        <input type="hidden" name="id" value={donation.id} />
                        <select
                          name="status"
                          defaultValue={donation.status}
                          className="rounded-lg border border-slate-200 px-2 py-1 text-xs"
                        >
                          <option value="pending">En attente</option>
                          <option value="success">Confirmé</option>
                          <option value="failed">Échoué</option>
                        </select>
                        <button
                          type="submit"
                          className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-brand-400 hover:text-brand-700"
                        >
                          OK
                        </button>
                      </form>
                      {!donation.receiptSent && donation.donorEmail && (
                        <form action={markReceiptSent.bind(null, donation.id)}>
                          <button
                            type="submit"
                            className="rounded-lg border border-brand-200 px-3 py-1.5 text-xs font-semibold text-brand-700 hover:bg-brand-50"
                          >
                            <Icon name="mail" className="mr-1 inline h-3 w-3" />
                            Reçu envoyé
                          </button>
                        </form>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
