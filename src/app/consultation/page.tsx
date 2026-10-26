import type { Metadata } from "next";
import Link from "next/link";

import { PageHero } from "@/components/breadcrumb";
import { Icon } from "@/components/icons";
import { ConsultationForm } from "@/components/public/consultation-form";
import { getPublishedServices } from "@/lib/content";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Demander une consultation",
  description:
"Envoyez votre demande de consultation à l'hôpital « La Croix » de Zinvié : l'hôpital vous rappellera pour fixer le rendez-vous.",
};

export default async function ConsultationPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string; motif?: string }>;
}) {
  const params = await searchParams;
  const [services, settings] = await Promise.all([
    getPublishedServices(),
    getSettings(),
  ]);

  const options = services.map((service) => ({
    slug: service.slug,
    name: service.name,
    hours: service.hours,
  }));

  return (
    <>
      <PageHero
        eyebrow="Prise de rendez-vous"
        title="Demander une consultation"
        subtitle="Remplissez ce formulaire : l'hôpital vous rappellera pour fixer le rendez-vous. Cette demande n'est pas un rendez-vous confirmé."
        breadcrumb={[{ label: "Demander une consultation" }]}
      />

      <section className="container-page py-14 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="card p-6 sm:p-8">
            <h2 className="text-lg font-bold text-brand-900">
              Formulaire de demande
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Les champs marqués d&apos;un astérisque sont obligatoires.
            </p>
            <div className="mt-6">
              <ConsultationForm
                services={options}
                defaultService={params.service ?? ""}
                defaultMotif={params.motif ?? ""}
              />
            </div>
          </div>

          <aside className="space-y-5">
            <div className="card p-6">
              <h2 className="font-bold text-brand-900">Comment ça marche ?</h2>
              <ol className="mt-4 space-y-4">
                {[
                  {
                    icon: "mail" as const,
                    title: "1. Vous envoyez votre demande",
                    text: "Nom, téléphone, service souhaité, date préférée et motif.",
                  },
                  {
                    icon: "phone" as const,
                    title: "2. L'hôpital vous rappelle",
                    text: "Notre équipe vous contacte pour préciser le créneau.",
                  },
                  {
                    icon: "check" as const,
                    title: "3. Le rendez-vous est fixé",
                    text: "Vous recevez la confirmation du rendez-vous convenu.",
                  },
                ].map((step) => (
                  <li key={step.title} className="flex gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[3px] bg-brand-50 text-brand-700">
                      <Icon name={step.icon} className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-brand-900">
                        {step.title}
                      </p>
                      <p className="mt-0.5 text-sm text-slate-600">{step.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-[4px] bg-brand-900 p-6 text-white">
              <h2 className="font-bold">Urgence ?</h2>
              <p className="mt-2 text-sm leading-relaxed text-brand-100/85">
                Les urgences adultes et pédiatriques sont assurées en
                permanence, 24h/24 et 7j/7. N&apos;attendez pas la suite de la
                demande : appelez directement.
              </p>
              <a
                href={`tel:${settings.phone.replace(/\s/g, "")}`}
                className="btn btn-accent mt-5 w-full"
              >
                <Icon name="phone" className="h-4 w-4" />
                {settings.phone}
              </a>
            </div>

            <div className="card p-6">
              <h2 className="font-bold text-brand-900">Horaires</h2>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <Icon name="clock" className="h-4 w-4 text-brand-600" />
                  {settings.openingHours}
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="ambulance" className="h-4 w-4 text-cross-600" />
                  {settings.emergencyHours}
                </li>
              </ul>
              <Link href="/faq" className="btn btn-ghost mt-5 w-full">
                Voir la FAQ
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
