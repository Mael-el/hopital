import Link from "next/link";
import { asc } from "drizzle-orm";

import {
  AdminHeader,
  Checkbox,
  EmptyState,
  Field,
  StatusBadge,
  SubmitButton,
  TextArea,
} from "@/components/admin/ui";
import { Icon } from "@/components/icons";
import { db } from "@/db";
import { doctors, services } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { deleteDoctor, saveDoctor } from "../actions";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ modifier?: string; nouveau?: string }> };

export default async function AdminDoctorsPage({ searchParams }: Props) {
  await requireUser(["admin", "content"]);
  const { modifier, nouveau } = await searchParams;

  const [all, allServices] = await Promise.all([
    db.select().from(doctors).orderBy(asc(doctors.order)),
    db.select().from(services).orderBy(asc(services.name)),
  ]);

  const editing = modifier
    ? all.find((doctor) => String(doctor.id) === modifier) ?? null
    : null;
  const showForm = Boolean(nouveau) || Boolean(editing);

  return (
    <div>
      <AdminHeader
        title="Médecins"
        description="Gérez l'équipe médicale : nom, spécialité, service d'affectation et jours de présence."
        action={
          <Link href="/admin/medecins?nouveau=1" className="btn btn-primary">
            <Icon name="users" className="h-4 w-4" />
            Ajouter un praticien
          </Link>
        }
      />

      {showForm && (
        <form
          action={saveDoctor}
          className="mb-8 rounded-[3px] border border-brand-200 bg-white p-6"
        >
          {editing && <input type="hidden" name="id" value={editing.id} />}
          <h2 className="font-bold text-slate-800">
            {editing ? `Modifier « ${editing.name} »` : "Nouveau praticien"}
          </h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field
              label="Nom et prénom(s)"
              name="name"
              defaultValue={editing?.name ?? ""}
              required
            />
            <div>
              <label htmlFor="kind" className="field-label">
                Type de fiche
              </label>
              <select
                id="kind"
                name="kind"
                defaultValue={editing?.kind ?? "medecin"}
                className="field-input"
              >
                <option value="medecin">Médecin / praticien</option>
                <option value="equipe">Consultation de spécialité (équipe)</option>
              </select>
            </div>
            <Field
              label="Spécialité"
              name="specialty"
              defaultValue={editing?.specialty ?? ""}
              required
            />
            <div>
              <label htmlFor="serviceId" className="field-label">
                Service d&rsquo;affectation
              </label>
              <select
                id="serviceId"
                name="serviceId"
                defaultValue={editing?.serviceId ?? ""}
                className="field-input"
              >
                <option value="">— Aucun —</option>
                {allServices.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </select>
            </div>
            <Field
              label="Fonction"
              name="role"
              defaultValue={editing?.role ?? ""}
              placeholder="Ex. Directeur Sanitaire"
            />
            <Field
              label="Jours de présence"
              name="days"
              defaultValue={editing?.days ?? ""}
              placeholder="Ex. Lundi, Mercredi, Vendredi"
            />
            <Field
              label="Horaires"
              name="hours"
              defaultValue={editing?.hours ?? ""}
              placeholder="Ex. 08h00 – 12h00"
            />
            <Field
              label="Ordre d'affichage"
              name="order"
              type="number"
              defaultValue={String(editing?.order ?? all.length + 1)}
            />
          </div>

          <div className="mt-4">
            <TextArea
              label="Présentation"
              name="bio"
              defaultValue={editing?.bio ?? ""}
              rows={5}
            />
          </div>

          <div className="mt-4">
            <Checkbox
              label="Publier sur le site"
              name="published"
              defaultChecked={editing?.published ?? true}
            />
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <SubmitButton label={editing ? "Enregistrer" : "Ajouter"} />
            <Link href="/admin/medecins" className="btn btn-ghost">
              Annuler
            </Link>
          </div>
        </form>
      )}

      {all.length === 0 ? (
        <EmptyState
          title="Aucun praticien"
          text="Ajoutez un premier membre de l'équipe médicale."
          icon="users"
        />
      ) : (
        <div className="overflow-x-auto rounded-[3px] border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Praticien</th>
                <th className="px-4 py-3">Spécialité / service</th>
                <th className="px-4 py-3">Jours</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {all.map((doctor) => {
                const service = allServices.find((item) => item.id === doctor.serviceId);
                return (
                  <tr key={doctor.id} className="align-top">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-800">{doctor.name}</p>
                      {doctor.role && (
                        <p className="mt-0.5 text-xs text-slate-500">{doctor.role}</p>
                      )}
                      <p className="mt-1 text-xs text-slate-400">
                        {doctor.kind === "medecin" ? "Médecin" : "Consultation d'équipe"}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-slate-700">{doctor.specialty}</p>
                      {service && (
                        <p className="mt-0.5 text-xs text-slate-500">{service.name}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600">
                      {doctor.days || "—"}
                      {doctor.hours && (
                        <span className="mt-0.5 block text-slate-400">{doctor.hours}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={doctor.published ? "published" : "unpublished"} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/medecins?modifier=${doctor.id}`}
                          className="rounded-[3px] border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-brand-400 hover:text-brand-700"
                        >
                          Modifier
                        </Link>
                        <form action={deleteDoctor}>
                          <input type="hidden" name="id" value={doctor.id} />
                          <button
                            type="submit"
                            className="rounded-[3px] border border-cross-200 px-3 py-1.5 text-xs font-semibold text-cross-700 hover:bg-cross-50"
                          >
                            Supprimer
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
