import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { PageHero } from "@/components/breadcrumb";
import { Icon, type IconName } from "@/components/icons";
import { getPublishedServices } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Nos services",
  description:
"Les 7 services principaux de l'hôpital « La Croix » de Zinvié : médecine générale, ophtalmologie, gynécologie-obstétrique, chirurgie, oncologie, tuberculose et ulcère de Buruli, ainsi que les départements hospitaliers.",
};

export default async function ServicesPage() {
  const services = await getPublishedServices();
  const principal = services.filter((service) => service.category === "principal");
  const departments = services.filter((service) => service.category !== "principal");

  return (
    <>
      <PageHero
        eyebrow="Plateau technique"
        title="Nos services"
        subtitle="Médecine générale et spécialités, urgences, maternité, chirurgie, oncologie et prise en charge des maladies transmissibles — un plateau technique complet au service de la population de Zinvié."
        breadcrumb={[{ label: "Services" }]}
      />

      {/* Bandeau photographique */}
      <section className="border-b border-sand-200">
        <div className="container-page grid items-stretch gap-0 lg:grid-cols-[1.4fr_1fr]">
          <div className="relative min-h-56 bg-sand-100 sm:min-h-72">
            <Image
              src="/images/hero-hopital.jpg"
              alt="Le bâtiment de l'hôpital « La Croix » de Zinvié"
              fill
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover"
            />
          </div>
          <dl className="grid grid-cols-2 bg-sand-100 lg:grid-cols-2">
            {[
              { label: "Capacité", value: "100 lits" },
              { label: "Médecins", value: "50+" },
              { label: "Urgences", value: "24h/24" },
              { label: "Créé en", value: "1974" },
            ].map((item) => (
              <div
                key={item.label}
                className="border-b border-r border-sand-200 px-6 py-6 last:border-r-0"
              >
                <dt className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-slate-500">
                  {item.label}
                </dt>
                <dd className="mt-2 font-serif text-2xl font-bold text-brand-800">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="container-page py-14 lg:py-16">
        <p className="section-label">Offre de soins</p>
        <h2 className="mt-5 section-title">
          Les 7 services principaux
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
          Vous pouvez consulter la fiche détaillée de chaque service : description
          des prestations, horaires de consultation et emplacement dans
          l&apos;hôpital.
        </p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {principal.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </section>

      {departments.length > 0 && (
        <section className="bg-white py-14 lg:py-16">
          <div className="container-page">
            <h2 className="text-xl font-bold tracking-tight text-brand-900 sm:text-2xl">
              Départements et unités de soins
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
              Urgences, pédiatrie, néonatologie, kinésithérapie, imagerie
              médicale, laboratoire, cardiologie, ORL, urologie, réanimation,
              traumatologie, anatomopathologie, neurochirurgie et aumônerie.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {departments.map((service) => (
                <Link
                  key={service.id}
                  href={`/services/${service.slug}`}
                  className="group flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-5 transition-colors hover:border-brand-300 "
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-care-50 text-care-700 transition group-hover:bg-brand-700 group-hover:text-white">
                    <Icon
                      name={(service.icon as IconName) ?? "stethoscope"}
                      className="h-5 w-5"
                    />
                  </span>
                  <span>
                    <span className="block font-semibold text-brand-900">
                      {service.name}
                    </span>
                    <span className="mt-1 block text-sm leading-relaxed text-slate-600">
                      {service.shortDescription}
                    </span>
                    <span className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-brand-700">
                      <Icon name="clock" className="h-3.5 w-3.5" />
                      {service.hours}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="container-page py-14">
        <div className="flex flex-col items-center justify-between gap-6 rounded-xl bg-brand-900 px-8 py-10 text-center text-white sm:flex-row sm:text-left">
          <div>
            <h2 className="text-xl font-bold sm:text-2xl">
              Besoin d&apos;une consultation ?
            </h2>
            <p className="mt-2 text-brand-100/85">
              Envoyez votre demande en ligne, l&apos;hôpital vous rappellera pour
              fixer le rendez-vous.
            </p>
          </div>
          <Link href="/consultation" className="btn btn-accent">
            <Icon name="calendar" className="h-4 w-4" />
            Demander une consultation
          </Link>
        </div>
      </section>
    </>
  );
}

function ServiceCard({
  service,
}: {
  service: {
    id: number;
    slug: string;
    name: string;
    shortDescription: string;
    hours: string;
    icon: string;
    appointment: boolean;
  };
}) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="card group flex flex-col p-6 transition-colors hover:border-brand-300 "
    >
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-care-50 text-care-700 transition group-hover:bg-brand-700 group-hover:text-white">
          <Icon name={(service.icon as IconName) ?? "stethoscope"} className="h-6 w-6" />
        </span>
        {service.appointment && (
          <span className="badge bg-cross-50 text-cross-700">
            <Icon name="calendar" className="h-3 w-3" />
            Sur rendez-vous
          </span>
        )}
      </div>
      <h3 className="mt-4 text-lg font-bold text-brand-900">{service.name}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
        {service.shortDescription}
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4">
        <span className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
          <Icon name="clock" className="h-3.5 w-3.5 text-brand-600" />
          {service.hours}
        </span>
        <span className="ml-auto flex items-center gap-1 text-sm font-semibold text-brand-700">
          Fiche du service
          <Icon name="arrow-right" className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
}
