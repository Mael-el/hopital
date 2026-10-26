import type { Metadata } from "next";
import Link from "next/link";

import { Icon } from "@/components/icons";
import { PrintButton } from "@/components/public/print-button";
import { getPrincipalServices, getPublishedServices } from "@/lib/content";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Fiche pratique de l'hôpital",
  description:
    "Fiche imprimable de l'hôpital « La Croix » de Zinvié : services, horaires, contacts, urgences et plan d'accès.",
};

export default async function PrintableSheetPage() {
  const [settings, principal, services] = await Promise.all([
    getSettings(),
    getPrincipalServices(),
    getPublishedServices(),
  ]);

  const departments = services.filter((service) => service.category !== "principal");

  return (
    <section className="container-page py-10">
      <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-brand-900">
            Fiche pratique de l&apos;hôpital
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Version imprimable à remettre aux patients, aux familles et aux
            visiteurs.
          </p>
        </div>
        <div className="flex gap-3">
          <PrintButton />
          <Link href="/contact" className="btn btn-ghost">
            Retour au contact
          </Link>
        </div>
      </div>

      {/* Feuille A4 */}
      <div className="mx-auto max-w-4xl border border-sand-300 bg-white p-8 print:border-0 print:p-0">
        {/* En-tête */}
        <div className="flex flex-wrap items-start justify-between gap-6 border-b-2 border-brand-800 pb-5">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-[3px] bg-brand-800 text-white">
              <Icon name="cross" className="h-7 w-7" strokeWidth={2.2} />
            </span>
            <div>
              <h2 className="font-serif text-2xl font-bold leading-tight text-brand-900">
                Hôpital « La Croix » de Zinvié
              </h2>
              <p className="mt-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-cross-600">
                Centre de Santé à Vocation Humanitaire — Fondé en 1974
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Formation sanitaire des Religieux Camilliens
              </p>
            </div>
          </div>
          <div className="text-right text-xs leading-relaxed text-slate-600">
            <p className="font-semibold text-brand-900">Yêvié, Route de Zinvié</p>
            <p>Commune d&apos;Abomey-Calavi — Atlantique, Bénin</p>
            <p>40 km de Cotonou</p>
          </div>
        </div>

        {/* Contacts */}
        <div className="mt-7 grid gap-6 sm:grid-cols-3">
          <div className="print:border print:border-sand-300 print:p-4">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-cross-600">
              Urgences 24h/24
            </p>
            <p className="mt-2 font-serif text-xl font-bold text-brand-900">
              {settings.phone}
            </p>
            <p className="mt-1 text-xs text-slate-500">{settings.phoneSecondary}</p>
          </div>
          <div className="print:border print:border-sand-300 print:p-4">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-cross-600">
              Horaires
            </p>
            <p className="mt-2 text-sm font-semibold text-brand-900">
              {settings.openingHours}
            </p>
            <p className="mt-1 text-xs text-slate-500">{settings.emergencyHours}</p>
            <p className="text-xs text-slate-500">{settings.saturdayHours}</p>
          </div>
          <div className="print:border print:border-sand-300 print:p-4">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-cross-600">
              Contact
            </p>
            <p className="mt-2 text-sm font-semibold text-brand-900">
              {settings.email}
            </p>
            <p className="mt-1 text-xs text-slate-500">{settings.website}</p>
            <p className="text-xs text-slate-500">{settings.beds} · {settings.staffCount}</p>
          </div>
        </div>

        {/* Services principaux */}
        <section className="mt-8">
          <h3 className="border-b border-sand-300 pb-2 font-serif text-lg font-bold text-brand-900">
            Les 7 services principaux
          </h3>
          <ul className="mt-4 grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
            {principal.map((service) => (
              <li key={service.id} className="flex gap-2 text-sm">
                <Icon name="check" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-700" />
                <span>
                  <strong className="font-semibold text-brand-900">
                    {service.name}
                  </strong>
                  <span className="block text-xs text-slate-500">{service.hours}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Départements */}
        <section className="mt-7">
          <h3 className="border-b border-sand-300 pb-2 font-serif text-lg font-bold text-brand-900">
            Départements et unités de soins
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            {departments.map((service) => service.name).join(" · ")}
          </p>
        </section>

        {/* Accès + assurances */}
        <section className="mt-7 grid gap-6 sm:grid-cols-2">
          <div>
            <h3 className="border-b border-sand-300 pb-2 font-serif text-lg font-bold text-brand-900">
              Accès
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Depuis Cotonou, prendre la direction d&apos;Abomey-Calavi puis
              Yêvié et Zinvié (40 km). L&apos;hôpital dispose d&apos;un service
              d&apos;urgences adulte et pédiatrique en permanence.
            </p>
            <p className="mt-3 text-sm">
              <a
                href={settings.mapLink}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-brand-700 underline"
              >
                Voir le plan sur Google Maps
              </a>
            </p>
          </div>
          <div>
            <h3 className="border-b border-sand-300 pb-2 font-serif text-lg font-bold text-brand-900">
              Aumônerie &amp; accompagnement
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Une aumônerie est présente en permanence : elle accompagne et
              écoute les malades et leurs familles, dans le respect de chacun.
              Collaboration étroite avec les paroisses et les associations
              locales.
            </p>
          </div>
        </section>

        {/* Pied de fiche */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t-2 border-brand-800 pt-4 text-[0.68rem] text-slate-500">
          <span>
            {settings.hospitalName} — {settings.legalName}
          </span>
          <span>Fiche imprimable — ne remplace pas une consultation</span>
        </div>
      </div>
    </section>
  );
}
