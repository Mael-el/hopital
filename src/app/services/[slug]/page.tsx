import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumb, PageHero } from "@/components/breadcrumb";
import { Icon, type IconName } from "@/components/icons";
import { getPublishedDoctors, getPublishedServices, getServiceBySlug } from "@/lib/content";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return { title: "Service introuvable" };
  return {
    title: service.name,
    description: service.shortDescription,
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  const [allServices, doctors] = await Promise.all([
    getPublishedServices(),
    getPublishedDoctors(),
  ]);

  const team = doctors.filter((doctor) => doctor.serviceId === service.id);
  const others = allServices
    .filter((item) => item.id !== service.id)
    .slice(0, 6);

  return (
    <>
      <PageHero
        eyebrow="Fiche service"
        title={service.name}
        subtitle={service.shortDescription}
        breadcrumb={[
          { label: "Services", href: "/services" },
          { label: service.name },
        ]}
      >
        <div className="flex flex-wrap gap-3">
          <Link href="/consultation" className="btn btn-accent">
            <Icon name="calendar" className="h-4 w-4" />
            Demander une consultation
          </Link>
          <a
            href={`tel:+2290195886853`}
            className="btn btn-outline border-white/40 text-white hover:bg-white hover:text-brand-900"
          >
            <Icon name="phone" className="h-4 w-4" />
            Appeler l&rsquo;hôpital
          </a>
        </div>
      </PageHero>

      <section className="container-page py-14 lg:py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <div>
            <div className="prose-hospital text-slate-600">
              {service.description.split("\n\n").map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {team.length > 0 && (
              <div className="mt-10">
                <h2 className="text-lg font-bold text-brand-900">
                  Équipe &amp; consultations
                </h2>
                <div className="mt-4 space-y-3">
                  {team.map((doctor) => (
                    <div
                      key={doctor.id}
                      className="card flex items-start gap-4 p-5"
                    >
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-50 font-bold text-brand-700">
                        {doctor.name
                          .split(" ")
                          .slice(0, 2)
                          .map((part) => part[0])
                          .join("")}
                      </span>
                      <div>
                        <p className="font-semibold text-brand-900">
                          {doctor.name}
                        </p>
                        <p className="text-sm text-slate-600">{doctor.specialty}</p>
                        {doctor.days && (
                          <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                            <Icon name="calendar" className="h-3.5 w-3.5" />
                            {doctor.days}
                            {doctor.hours ? ` — ${doctor.hours}` : ""}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="space-y-4">
            <div className="card p-6">
              <h2 className="font-bold text-brand-900">Informations pratiques</h2>
              <dl className="mt-4 space-y-4 text-sm">
                <div className="flex gap-3">
                  <Icon name="clock" className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                  <div>
                    <dt className="font-semibold text-slate-800">Horaires</dt>
                    <dd className="text-slate-600">{service.hours}</dd>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Icon name="map" className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                  <div>
                    <dt className="font-semibold text-slate-800">Emplacement</dt>
                    <dd className="text-slate-600">{service.location}</dd>
                  </div>
                </div>
                {service.headName && (
                  <div className="flex gap-3">
                    <Icon name="users" className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                    <div>
                      <dt className="font-semibold text-slate-800">
                        Responsable
                      </dt>
                      <dd className="text-slate-600">{service.headName}</dd>
                    </div>
                  </div>
                )}
                <div className="flex gap-3">
                  <Icon name="calendar" className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                  <div>
                    <dt className="font-semibold text-slate-800">Rendez-vous</dt>
                    <dd className="text-slate-600">
                      {service.appointment
                        ? "Consultation sur rendez-vous (demande à valider par l'hôpital)."
                        : "Consultation libre aux heures d'ouverture."}
                    </dd>
                  </div>
                </div>
              </dl>

              <Link href="/consultation" className="btn btn-primary mt-6 w-full">
                <Icon name="calendar" className="h-4 w-4" />
                Demander une consultation
              </Link>
            </div>

            <div className="rounded-xl bg-brand-900 p-6 text-white">
              <Icon name="heart" className="h-6 w-6 text-cross-300" />
              <h3 className="mt-3 font-bold">Une aumônerie à votre écoute</h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-100/80">
                Quelle que soit votre prise en charge, l&apos;équipe de
                l&apos;aumônerie de l&apos;hôpital vous accompagne et vous
                écoute, dans le respect de chacun.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="container-page">
          <h2 className="text-lg font-bold text-brand-900">Autres services</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((other) => (
              <Link
                key={other.id}
                href={`/services/${other.slug}`}
                className="group flex items-center gap-3 rounded-lg border border-slate-200 p-4 transition hover:border-brand-300 hover:bg-brand-50/50"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-care-50 text-care-700">
                  <Icon
                    name={(other.icon as IconName) ?? "stethoscope"}
                    className="h-5 w-5"
                  />
                </span>
                <span className="font-medium text-brand-900">{other.name}</span>
                <Icon
                  name="arrow-right"
                  className="ml-auto h-4 w-4 text-brand-500 transition group-hover:translate-x-1"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="container-page py-8">
        <Breadcrumb
          items={[
            { label: "Services", href: "/services" },
            { label: service.name },
          ]}
        />
      </div>
    </>
  );
}
