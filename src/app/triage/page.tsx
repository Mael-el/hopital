import type { Metadata } from "next";
import Link from "next/link";

import { PageHero } from "@/components/breadcrumb";
import { Icon } from "@/components/icons";
import { TriageAssistant } from "@/components/public/triage-assistant";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Orientation vers le bon service",
  description:
    "Assistant d'orientation gratuit : identifiez le service de l'hôpital « La Croix » de Zinvié qui correspond à votre situation et le délai de consultation conseillé.",
};

export default function TriagePage() {
  return (
    <>
      <PageHero
        eyebrow="Service aux patients"
        title="Quel service consulter ?"
        subtitle="Répondez à cinq questions simples : nous vous orientons vers le bon service de l'hôpital et vous indiquons le délai de consultation conseillé."
        breadcrumb={[{ label: "Orientation" }]}
      />

      <section className="container-page py-14 lg:py-16">
        <TriageAssistant />
      </section>

      <section className="border-t border-sand-200 bg-sand-100 py-12">
        <div className="container-page grid gap-6 md:grid-cols-3">
          <div className="flex gap-4">
            <Icon name="shield" className="mt-0.5 h-5 w-5 shrink-0 text-brand-700" />
            <div>
              <h2 className="font-serif text-base font-bold text-brand-900">
                Un outil indicatif
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">
                Cette orientation ne remplace pas l&apos;avis d&apos;un
                professionnel de santé. En cas de doute, consultez sans
                attendre.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <Icon name="ambulance" className="mt-0.5 h-5 w-5 shrink-0 text-cross-600" />
            <div>
              <h2 className="font-serif text-base font-bold text-brand-900">
                Urgences 24h/24
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">
                Le service des urgences est assuré en permanence, jour et nuit,
                par l&apos;équipe de garde : n&apos;hésitez jamais à vous
                présenter directement.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <Icon name="phone" className="mt-0.5 h-5 w-5 shrink-0 text-brand-700" />
            <div>
              <h2 className="font-serif text-base font-bold text-brand-900">
                Un doute ? Appelez-nous
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">
                L&apos;accueil de l&apos;hôpital vous oriente par téléphone au{" "}
                <a href="tel:+2290195968400" className="font-semibold text-brand-700 underline">
                  +229 01 95 96 84 00
                </a>{" "}
                du lundi au vendredi de 8h00 à 16h00.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-12">
        <div className="flex flex-wrap items-center justify-between gap-4 border border-sand-200 bg-white p-6">
          <p className="text-sm text-slate-600">
            Vous avez déjà identifié le service dont vous avez besoin ?
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/services" className="btn btn-ghost">
              Voir les services
            </Link>
            <Link href="/consultation" className="btn btn-accent">
              <Icon name="calendar" className="h-4 w-4" />
              Demander une consultation
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
