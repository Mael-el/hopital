import { asc } from "drizzle-orm";

import {
  AdminHeader,
  Checkbox,
  Field,
  SubmitButton,
  TextArea,
} from "@/components/admin/ui";
import { db } from "@/db";
import { donationNeeds } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { getSettings } from "@/lib/settings";
import { deleteDonationNeed, saveDonationNeed, updateSettings } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  await requireUser(["admin"]);
  const settings = await getSettings();
  const needs = await db.select().from(donationNeeds).orderBy(asc(donationNeeds.order));

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Paramètres"
        description="Coordonnées de l'hôpital, moyens de don, liens Facebook / WhatsApp et besoins à financer."
      />

      <form action={updateSettings} className="space-y-6">
        <section className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="font-bold text-slate-800">Identité de l&rsquo;établissement</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field
              label="Nom de l'hôpital"
              name="hospitalName"
              defaultValue={settings.hospitalName}
            />
            <Field
              label="Nom officiel"
              name="legalName"
              defaultValue={settings.legalName}
            />
            <Field
              label="Nom court"
              name="shortName"
              defaultValue={settings.shortName}
            />
            <Field label="Année de création" name="founded" defaultValue={settings.founded} />
            <div className="sm:col-span-2">
              <Field label="Accroche" name="tagline" defaultValue={settings.tagline} />
            </div>
            <div className="sm:col-span-2">
              <TextArea
                label="Présentation courte"
                name="presentation"
                defaultValue={settings.presentation}
                rows={5}
              />
            </div>
            <Field label="Capacité" name="beds" defaultValue={settings.beds} />
            <Field label="Effectif" name="staffCount" defaultValue={settings.staffCount} />
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="font-bold text-slate-800">Coordonnées</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field
              label="Adresse (ligne 1)"
              name="addressLine1"
              defaultValue={settings.addressLine1}
            />
            <Field
              label="Adresse (ligne 2)"
              name="addressLine2"
              defaultValue={settings.addressLine2}
            />
            <Field
              label="Adresse (ligne 3)"
              name="addressLine3"
              defaultValue={settings.addressLine3}
            />
            <Field label="Téléphone principal" name="phone" defaultValue={settings.phone} />
            <Field
              label="Téléphone secondaire"
              name="phoneSecondary"
              defaultValue={settings.phoneSecondary}
            />
            <Field
              label="Téléphone urgences"
              name="phoneEmergency"
              defaultValue={settings.phoneEmergency}
            />
            <Field label="E-mail principal" name="email" type="email" defaultValue={settings.email} />
            <Field label="E-mail secondaire" name="emailSecondary" type="email" defaultValue={settings.emailSecondary} />
            <Field label="E-mail de la direction" name="emailDirection" type="email" defaultValue={settings.emailDirection} />
            <Field label="E-mail laboratoire / banque du sang" name="emailLaboratory" type="email" defaultValue={settings.emailLaboratory} />
            <Field label="Site officiel" name="website" defaultValue={settings.website} />
            <Field label="Site secondaire" name="websiteSecondary" defaultValue={settings.websiteSecondary} />
            <Field label="Facebook" name="facebook" defaultValue={settings.facebook} />
            <Field label="WhatsApp" name="whatsapp" defaultValue={settings.whatsapp} />
            <Field label="Coordonnées GPS" name="mapCoordinates" defaultValue={settings.mapCoordinates} />
            <Field label="Plus code" name="plusCode" defaultValue={settings.plusCode} />
            <Field label="Bassin de population" name="populationBasin" defaultValue={settings.populationBasin} />
            <div className="sm:col-span-2">
              <Field
                label="Lien Google Maps (plan d'accès)"
                name="mapLink"
                defaultValue={settings.mapLink}
              />
            </div>
            <div className="sm:col-span-2">
              <Field
                label="Carte intégrée (iframe)"
                name="mapEmbed"
                defaultValue={settings.mapEmbed}
                hint="Collez l'URL d'intégration Google Maps."
              />
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="font-bold text-slate-800">
            Développeur & maintenance technique
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Coordonnées du développeur référent du site. Elles sont affichées
            dans le pied de page et sur la page Contact.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field
              label="Nom du développeur"
              name="developerName"
              defaultValue={settings.developerName}
            />
            <Field
              label="Fonction"
              name="developerRole"
              defaultValue={settings.developerRole}
            />
            <Field
              label="E-mail"
              name="developerEmail"
              type="email"
              defaultValue={settings.developerEmail}
            />
            <Field
              label="Téléphone"
              name="developerPhone"
              defaultValue={settings.developerPhone}
            />
            <div className="sm:col-span-2">
              <TextArea
                label="Texte affiché sur le site"
                name="developerNote"
                defaultValue={settings.developerNote}
                rows={3}
              />
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="font-bold text-slate-800">Horaires</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <Field
              label="Horaires des consultations"
              name="openingHours"
              defaultValue={settings.openingHours}
            />
            <Field
              label="Urgences"
              name="emergencyHours"
              defaultValue={settings.emergencyHours}
            />
            <Field
              label="Samedi / campagnes"
              name="saturdayHours"
              defaultValue={settings.saturdayHours}
            />
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="font-bold text-slate-800">Moyens de don affichés</h2>
          <p className="mt-1 text-sm text-slate-600">
            Le paiement est assuré par FedaPay (MTN Mobile Money, Moov Money,
            carte bancaire). Vous pouvez adapter les libellés affichés.
          </p>
          <div className="mt-4 grid gap-4">
            {[0, 1, 2].map((index) => {
              const method = settings.donationMethods[index];
              return (
                <div
                  key={index}
                  className="grid gap-3 rounded-lg border border-slate-100 p-3 sm:grid-cols-2"
                >
                  <Field
                    label={`Moyen ${index + 1}`}
                    name={`method${index + 1}Name`}
                    defaultValue={method?.name ?? ""}
                  />
                  <Field
                    label={`Détail ${index + 1}`}
                    name={`method${index + 1}Detail`}
                    defaultValue={method?.detail ?? ""}
                  />
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="font-bold text-slate-800">Archivage</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field
              label="Durée de conservation des archives (mois)"
              name="archiveRetentionMonths"
              type="number"
              defaultValue={String(settings.archiveRetentionMonths)}
              hint="Les données inactives depuis plus de 30 jours sont archivées automatiquement."
            />
          </div>
        </section>

        <SubmitButton label="Enregistrer les paramètres" />
      </form>

      <section className="rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="font-bold text-slate-800">Besoins de l&rsquo;hôpital</h2>
        <p className="mt-1 text-sm text-slate-600">
          Ces besoins sont affichés sur la page « Faire un don ».
        </p>

        <div className="mt-5 space-y-3">
          {needs.map((need) => (
            <div key={need.id} className="rounded-lg border border-slate-200 p-4">
              <form action={saveDonationNeed} className="grid gap-3">
                <input type="hidden" name="id" value={need.id} />
                <div className="grid gap-3 sm:grid-cols-4">
                  <div className="sm:col-span-2">
                    <Field label="Titre" name="title" defaultValue={need.title} />
                  </div>
                  <Field label="Icône" name="icon" defaultValue={need.icon} />
                  <Field
                    label="Objectif (FCFA)"
                    name="targetAmount"
                    type="number"
                    defaultValue={String(need.targetAmount)}
                  />
                </div>
                <TextArea
                  label="Description"
                  name="description"
                  defaultValue={need.description}
                  rows={3}
                />
                <div className="flex flex-wrap items-center gap-4">
                  <Field
                    label="Ordre"
                    name="order"
                    type="number"
                    defaultValue={String(need.order)}
                  />
                  <div className="flex items-end pb-2">
                    <Checkbox
                      label="Publié"
                      name="published"
                      defaultChecked={need.published}
                    />
                  </div>
                  <div className="flex items-end pb-1">
                    <SubmitButton label="Mettre à jour" />
                  </div>
                </div>
              </form>
              <form action={deleteDonationNeed} className="mt-2">
                <input type="hidden" name="id" value={need.id} />
                <button
                  type="submit"
                  className="text-xs font-semibold text-cross-600 hover:underline"
                >
                  Supprimer ce besoin
                </button>
              </form>
            </div>
          ))}
        </div>

        <form
          action={saveDonationNeed}
          className="mt-5 grid gap-3 rounded-lg bg-slate-50 p-4"
        >
          <p className="text-sm font-semibold text-slate-700">
            Ajouter un besoin
          </p>
          <div className="grid gap-3 sm:grid-cols-4">
            <div className="sm:col-span-2">
              <Field label="Titre" name="title" required />
            </div>
            <Field label="Icône" name="icon" defaultValue="cross" />
            <Field label="Objectif (FCFA)" name="targetAmount" type="number" defaultValue="0" />
          </div>
          <TextArea label="Description" name="description" rows={3} required />
          <div>
            <SubmitButton label="Ajouter le besoin" />
          </div>
        </form>
      </section>
    </div>
  );
}
