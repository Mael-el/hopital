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
import { services } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { deleteService, saveService, toggleServicePublished } from "../actions";

export const dynamic = "force-dynamic";

const ICONS = [
"stethoscope",
"eye",
"baby",
"activity",
"shield",
"lungs",
"droplet",
"ambulance",
"scan",
"microscope",
"heart",
"brain",
"bone",
"cross",
"users",
];

type Props = { searchParams: Promise<{ modifier?: string; nouveau?: string }> };

export default async function AdminServicesPage({ searchParams }: Props) {
  await requireUser(["admin", "content"]);
  const { modifier, nouveau } = await searchParams;

  const all = await db.select().from(services).orderBy(asc(services.order));
  const editing = modifier
    ? all.find((service) => String(service.id) === modifier) ?? null
    : null;
  const showForm = Boolean(nouveau) || Boolean(editing);

  return (
    <div>
      <AdminHeader
        title="Services"
        description="Ajoutez, modifiez ou retirez les services proposés par l'hôpital."
        action={
          <Link href="/admin/services?nouveau=1" className="btn btn-primary">
            <Icon name="cross" className="h-4 w-4" />
            Ajouter un service
          </Link>
        }
      />

      {showForm && (
        <form
          action={saveService}
          className="mb-8 rounded-[3px] border border-brand-200 bg-white p-6"
        >
          {editing && <input type="hidden" name="id" value={editing.id} />}
          <h2 className="font-bold text-slate-800">
            {editing ? `Modifier « ${editing.name} »` : "Nouveau service"}
          </h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="Nom du service" name="name" defaultValue={editing?.name ?? ""} required />
            <Field
              label="Identifiant (URL)"
              name="slug"
              defaultValue={editing?.slug ?? ""}
              hint="Laissez vide pour un identifiant automatique."
            />
            <div>
              <label htmlFor="category" className="field-label">
                Catégorie
              </label>
              <select
                id="category"
                name="category"
                defaultValue={editing?.category ?? "principal"}
                className="field-input"
              >
                <option value="principal">Service principal</option>
                <option value="departement">Département / unité</option>
              </select>
            </div>
            <div>
              <label htmlFor="icon" className="field-label">
                Icône
              </label>
              <select
                id="icon"
                name="icon"
                defaultValue={editing?.icon ?? "stethoscope"}
                className="field-input"
              >
                {ICONS.map((icon) => (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                ))}
              </select>
            </div>
            <Field
              label="Horaires"
              name="hours"
              defaultValue={editing?.hours ?? "Lundi – Vendredi : 8h00 – 16h00"}
            />
            <Field
              label="Emplacement dans l'hôpital"
              name="location"
              defaultValue={editing?.location ?? ""}
            />
            <Field
              label="Responsable du service"
              name="headName"
              defaultValue={editing?.headName ?? ""}
            />
            <Field
              label="Ordre d'affichage"
              name="order"
              type="number"
              defaultValue={String(editing?.order ?? all.length + 1)}
            />
          </div>

          <div className="mt-4 grid gap-4">
            <TextArea
              label="Description courte"
              name="shortDescription"
              defaultValue={editing?.shortDescription ?? ""}
              rows={2}
              required
            />
            <TextArea
              label="Description détaillée"
              name="description"
              defaultValue={editing?.description ?? ""}
              rows={8}
              required
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-6">
            <Checkbox
              label="Consultation sur rendez-vous"
              name="appointment"
              defaultChecked={editing?.appointment ?? false}
            />
            <Checkbox
              label="Publier sur le site"
              name="published"
              defaultChecked={editing?.published ?? true}
            />
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <SubmitButton label={editing ? "Enregistrer" : "Créer le service"} />
            <Link href="/admin/services" className="btn btn-ghost">
              Annuler
            </Link>
          </div>
        </form>
      )}

      {all.length === 0 ? (
        <EmptyState
          title="Aucun service"
          text="Ajoutez le premier service de l'hôpital."
          icon="hospital"
        />
      ) : (
        <div className="overflow-x-auto rounded-[3px] border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Horaires</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {all.map((service) => (
                <tr key={service.id} className="align-top">
                  <td className="px-4 py-3">
                    <div className="flex items-start gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[3px] bg-brand-50 text-brand-700">
                        <Icon name={service.icon as never} className="h-4.5 w-4.5" />
                      </span>
                      <div>
                        <p className="font-semibold text-slate-800">{service.name}</p>
                        <p className="mt-0.5 max-w-md text-xs text-slate-500">
                          {service.shortDescription}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          {service.category === "principal" ? "Principal" : "Département"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600">{service.hours}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={service.published ? "published" : "unpublished"} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap justify-end gap-2">
                      <Link
                        href={`/admin/services?modifier=${service.id}`}
                        className="rounded-[3px] border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-brand-400 hover:text-brand-700"
                      >
                        Modifier
                      </Link>
                      <form action={toggleServicePublished.bind(null, service.id, !service.published)}>
                        <button
                          type="submit"
                          className="rounded-[3px] border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-brand-400 hover:text-brand-700"
                        >
                          {service.published ? "Dépublier" : "Publier"}
                        </button>
                      </form>
                      <form action={deleteService}>
                        <input type="hidden" name="id" value={service.id} />
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
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
