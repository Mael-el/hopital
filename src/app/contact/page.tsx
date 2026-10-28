import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { PageHero } from "@/components/breadcrumb";
import { Icon } from "@/components/icons";
import { ContactForm } from "@/components/public/contact-form";
import { EMERGENCY_NUMBERS, whatsappLink } from "@/components/public/emergency-panel";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact & accès",
  description:
"Contactez l'hôpital « La Croix » de Zinvié : adresse, téléphones, e-mail, plan d'accès, formulaire de contact, Facebook et WhatsApp.",
};

export default async function ContactPage() {
  const settings = await getSettings();

  return (
    <>
      <PageHero
        eyebrow="Nous joindre"
        title="Contact & plan d'accès"
        subtitle="Une question, un rendez-vous, un don de matériel ? Notre équipe est joignable par téléphone, e-mail ou via le formulaire ci-dessous."
        breadcrumb={[{ label: "Contact" }]}
      />

      <section className="container-page py-14 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          {/* Coordonnées */}
          <div className="space-y-5">
            <div className="card p-6">
              <h2 className="font-bold text-brand-900">Coordonnées</h2>
              <ul className="mt-4 space-y-4 text-sm">
                <li className="flex gap-3">
                  <Icon name="map" className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                  <div>
                    <p className="font-semibold text-slate-800">Adresse</p>
                    <p className="text-slate-600">{settings.addressLine1}</p>
                    <p className="text-slate-600">{settings.addressLine2}</p>
                    <p className="text-slate-600">{settings.addressLine3}</p>
                    <a
                      href={settings.mapLink}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 inline-block font-semibold text-brand-700 underline"
                    >
                      Ouvrir dans Google Maps
                    </a>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Icon name="phone" className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                  <div>
                    <p className="font-semibold text-slate-800">Téléphone</p>
                    <a
                      href={`tel:${settings.phone.replace(/\s/g, "")}`}
                      className="block text-slate-600 hover:text-brand-700"
                    >
                      {settings.phone}
                    </a>
                    <a
                      href={`tel:${settings.phoneSecondary.replace(/\s/g, "")}`}
                      className="block text-slate-600 hover:text-brand-700"
                    >
                      {settings.phoneSecondary}
                    </a>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Icon name="ambulance" className="mt-0.5 h-5 w-5 shrink-0 text-cross-600" />
                  <div>
                    <p className="font-semibold text-slate-800">
                      Urgences (24h/24, 7j/7)
                    </p>
                    <a
                      href={`tel:${settings.phoneEmergency.replace(/\s/g, "")}`}
                      className="block text-slate-600 hover:text-brand-700"
                    >
                      {settings.phoneEmergency}
                    </a>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Icon name="mail" className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                  <div>
                    <p className="font-semibold text-slate-800">E-mail</p>
                    <a
                      href={`mailto:${settings.email}`}
                      className="break-all text-slate-600 hover:text-brand-700"
                    >
                      {settings.email}
                    </a>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Icon name="clock" className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                  <div>
                    <p className="font-semibold text-slate-800">Horaires</p>
                    <p className="text-slate-600">{settings.openingHours}</p>
                    <p className="text-slate-600">{settings.emergencyHours}</p>
                    <p className="text-slate-600">{settings.saturdayHours}</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <a
                href={`tel:${settings.phone.replace(/\s/g, "")}`}
                className="btn btn-accent w-full"
              >
                <Icon name="phone" className="h-4 w-4" />
                Appeler l&apos;hôpital
              </a>
              <a
                href={whatsappLink(
                  "Bonjour, je souhaite avoir des informations sur les consultations de l'hôpital La Croix de Zinvié.",
                )}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline w-full"
              >
                <Icon name="whatsapp" className="h-4 w-4" />
                WhatsApp
              </a>
              <a
                href={whatsappLink(
                  "Bonjour, je souhaite demander une consultation. Merci de me rappeler.",
                )}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline w-full"
              >
                <Icon name="calendar" className="h-4 w-4" />
                WhatsApp · RDV
              </a>
              <a
                href={settings.facebook}
                target="_blank"
                rel="noreferrer"
                className="btn btn-ghost w-full"
              >
                <Icon name="facebook" className="h-4 w-4" />
                Facebook
              </a>
              <a href="/consultation" className="btn btn-ghost w-full">
                <Icon name="calendar" className="h-4 w-4" />
                Prendre rendez-vous
              </a>
            </div>

            {/* Tous les canaux de contact */}
            <div className="card p-6">
              <h2 className="font-serif text-lg font-bold text-brand-900">
                Nos canaux de contact
              </h2>
              <ul className="mt-4 divide-y divide-sand-100">
                {settings.contactChannels.map((channel) => (
                  <li key={channel.label} className="flex flex-wrap items-center justify-between gap-3 py-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800">
                        {channel.label}
                      </p>
                      <p className="text-xs text-slate-500">{channel.detail}</p>
                    </div>
                    <a
                      href={`tel:${channel.value.replace(/\s/g, "")}`}
                      className="shrink-0 rounded-lg bg-brand-50 px-3 py-1.5 text-sm font-bold text-brand-800 transition hover:bg-brand-700 hover:text-white"
                    >
                      {channel.value}
                    </a>
                  </li>
                ))}
              </ul>

              <div className="mt-5 space-y-2 border-t border-sand-200 pt-4 text-sm">
                {[
                  { icon: "mail" as const, label: "Direction", value: settings.email, href: `mailto:${settings.email}` },
                  { icon: "mail" as const, label: "Secrétariat", value: settings.emailSecondary, href: `mailto:${settings.emailSecondary}` },
                  { icon: "users" as const, label: "Économat", value: settings.emailEconomat, href: `mailto:${settings.emailEconomat}` },
                ].map((row) => (
                  <div key={row.label} className="flex flex-wrap items-center justify-between gap-2">
                    <span className="flex items-center gap-2 text-slate-600">
                      <Icon name={row.icon} className="h-4 w-4 text-brand-700" />
                      {row.label}
                    </span>
                    <a
                      href={row.href}
                      className="break-all text-sm font-medium text-brand-700 hover:underline"
                    >
                      {row.value}
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Sites & réseaux sociaux */}
            <div className="card p-6">
              <h2 className="font-serif text-lg font-bold text-brand-900">
                Sites & réseaux sociaux
              </h2>
              <div className="mt-4 flex flex-wrap gap-2.5">
                {settings.socialLinks.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 rounded-lg border border-sand-200 px-3 py-2 text-sm text-slate-700 transition hover:border-brand-600 hover:text-brand-800"
                  >
                    <Icon name={(link.platform as never) ?? "globe"} className="h-4 w-4 text-brand-700" />
                    {link.label}
                  </a>
                ))}
              </div>
              <ul className="mt-4 space-y-2 border-t border-sand-200 pt-4 text-sm">
                {settings.webLinks.map((link) => (
                  <li key={link.url}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-brand-700 hover:underline"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-slate-500">
                Coordonnées GPS : {settings.mapCoordinates} — Plus code :{" "}
                {settings.plusCode}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Numéro IFU : {settings.ifu} — délivré le {settings.ifuIssueDate}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Web TV : {settings.webTv}
              </p>
            </div>

            {/* Numéros d'urgence */}
            <div className="card p-5">
              <h2 className="font-serif text-lg font-bold text-brand-900">
                Numéros d&apos;urgence
              </h2>
              <ul className="mt-3 divide-y divide-sand-100">
                {EMERGENCY_NUMBERS.map((item) => (
                  <li key={item.number} className="flex items-center justify-between gap-3 py-2.5">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{item.label}</p>
                      <p className="text-xs text-slate-500">{item.note}</p>
                    </div>
                    <a
                      href={`tel:${item.tel.replace(/\s/g, "")}`}
                      className="shrink-0 rounded-lg bg-brand-50 px-3 py-1.5 text-sm font-bold text-brand-800 transition hover:bg-brand-700 hover:text-white"
                    >
                      {item.number}
                    </a>
                  </li>
                ))}
              </ul>
              <Link
                href="/fiche-imprimable"
                className="btn btn-ghost mt-4 w-full"
              >
                <Icon name="book" className="h-4 w-4" />
                Fiche pratique imprimable
              </Link>
            </div>

            {/* Plan d'accès */}
            <div className="card overflow-hidden">
              <div className="relative h-44 bg-sand-100">
                <Image
                  src="/images/hero-hopital.jpg"
                  alt="Façade de l'hôpital « La Croix » de Zinvié"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
              <iframe
                title="Plan d'accès à l'Hôpital La Croix de Zinvié"
                src={settings.mapEmbed}
                className="h-80 w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="p-4 text-sm text-slate-600">
                <p className="font-semibold text-brand-900">
                  Yêvié, Route de Zinvié
                </p>
                <p className="mt-1">
                  À environ 40 km de Cotonou, sur la route de Yêvié puis Zinvié
                  (commune d&apos;Abomey-Calavi, département de l&apos;Atlantique).
                </p>
              </div>
            </div>
          </div>

          {/* Formulaire */}
          <div className="card p-6 sm:p-8">
            <h2 className="text-lg font-bold text-brand-900">
              Écrire à l&apos;hôpital
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Nous répondons à chaque message, du lundi au samedi.
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
