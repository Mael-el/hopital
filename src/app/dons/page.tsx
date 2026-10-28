import type { Metadata } from "next";
import Image from "next/image";

import { PageHero } from "@/components/breadcrumb";
import { Icon, type IconName } from "@/components/icons";
import { DonationForm } from "@/components/public/donation-form";
import { AnimatedCounter, ProgressBar } from "@/components/public/animated-counter";
import {
  getDonationCount,
  getPublishedDonationNeeds,
  getRaisedByPurpose,
  getTotalRaised,
} from "@/lib/content";
import { getSettings } from "@/lib/settings";
import { formatFcfa } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Faire un don",
  description:
"Soutenez l'hôpital « La Croix » de Zinvié : don en ligne sécurisé par FedaPay (MTN Mobile Money, Moov Money, carte bancaire).",
};

export default async function DonationsPage() {
  const [needs, settings, raised, donorCount, raisedByPurpose] = await Promise.all([
    getPublishedDonationNeeds(),
    getSettings(),
    getTotalRaised(),
    getDonationCount(),
    getRaisedByPurpose(),
  ]);

  return (
    <>
      <PageHero
        eyebrow="Soutenir l'hôpital"
        title="Faire un don"
        subtitle="Chaque don finance directement du matériel de soin, des examens et l'accompagnement des patients les plus vulnérables."
        breadcrumb={[{ label: "Faire un don" }]}
      />

      {/* Besoins de l'hôpital */}
      <section className="container-page py-14 lg:py-16">
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-label">
            Nos besoins
          </p>
          <h2 className="mt-3 section-title">
            Où vont vos dons ?
          </h2>
          <p className="mt-3 leading-relaxed text-slate-600">
            L&apos;hôpital « La Croix » de Zinvié vit de la solidarité :
            mtN MoMo, Moov Money, carte bancaire et dons en nature permettent de
            financer nos priorités d&apos;équipement et nos programmes de santé
            communautaire.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {needs.map((need) => (
            <div
              key={need.id}
              className="card flex flex-col p-6 transition-shadow "
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-care-50 text-care-700">
                <Icon name={(need.icon as IconName) ?? "cross"} className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-lg font-bold text-brand-900">
                {need.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                {need.description}
              </p>
              {need.targetAmount > 0 && (
                <div className="mt-4 border-t border-sand-100 pt-4">
                  <div className="flex items-baseline justify-between text-sm">
                    <span className="font-semibold text-brand-800">
                      {formatFcfa(raisedByPurpose[need.title] ?? 0)}
                    </span>
                    <span className="text-slate-500">
                      objectif {formatFcfa(need.targetAmount)}
                    </span>
                  </div>
                  <ProgressBar
                    raised={raisedByPurpose[need.title] ?? 0}
                    target={need.targetAmount}
                    className="mt-2"
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-brand-900 p-6 text-center text-white">
            <p className="font-serif text-3xl font-bold">
              <AnimatedCounter value={raised} /> FCFA
            </p>
            <p className="mt-1 text-sm text-brand-100/80">Collectés</p>
          </div>
          <div className="rounded-xl bg-brand-800 p-6 text-center text-white">
            <p className="font-serif text-3xl font-bold">
              <AnimatedCounter value={donorCount} />
            </p>
            <p className="mt-1 text-sm text-brand-100/80">Dons enregistrés</p>
          </div>
          <div className="rounded-xl bg-cross-600 p-6 text-center text-white">
            <p className="text-3xl font-bold">100%</p>
            <p className="mt-1 text-sm text-white/85">Réaffectés aux soins</p>
          </div>
        </div>
      </section>

      {/* Formulaire de don */}
      <section className="bg-white py-14 lg:py-16">
        <div className="container-page grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="card p-6 sm:p-8">
            <h2 className="text-lg font-bold text-brand-900">
              Donner en ligne
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Choisissez votre montant, puis proceedez au paiement sécurisé via
              FedaPay.
            </p>
            <div className="mt-6">
              <DonationForm purposes={needs.map((need) => ({ title: need.title }))} />
            </div>
          </div>

          <aside className="space-y-5">
            <div className="relative h-48 overflow-hidden rounded-xl bg-sand-100">
              <Image
                src="/images/dons-solidarite.jpg"
                alt="Accompagnement d'un patient par l'équipe soignante"
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover"
              />
            </div>

            <div className="card p-6">
              <h2 className="font-bold text-brand-900">Moyens de paiement</h2>
              <div className="mt-4 space-y-4">
                {settings.donationMethods.map((method) => (
                  <div key={method.name} className="flex gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-care-50 text-care-700">
                      <Icon name="hand-heart" className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-brand-900">
                        {method.name}
                      </p>
                      <p className="mt-0.5 text-sm text-slate-600">{method.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-lg bg-sand-100 p-4">
                <p className="text-xs leading-relaxed text-slate-600">
                  Le nom et l&apos;adresse e-mail sont facultatifs : ils nous
                  permettent uniquement de vous délivrer un reçu et de vous
                  remercier.
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-brand-50 p-6">
              <h2 className="font-bold text-brand-900">Autres façons d&apos;aider</h2>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li className="flex gap-2">
                  <Icon name="check" className="mt-0.5 h-4 w-4 text-brand-600" />
                  Donner du matériel médical (lits, pousse-seringes, produits)
                </li>
                <li className="flex gap-2">
                  <Icon name="check" className="mt-0.5 h-4 w-4 text-brand-600" />
                  Participer aux campagnes de don de sang
                </li>
                <li className="flex gap-2">
                  <Icon name="check" className="mt-0.5 h-4 w-4 text-brand-600" />
                  Bénévolat à la crèche de la maternité
                </li>
                <li className="flex gap-2">
                  <Icon name="check" className="mt-0.5 h-4 w-4 text-brand-600" />
                  Signaler un patient ayant besoin d&rsquo;une chirurgie
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
