import type { Metadata } from "next";
import Link from "next/link";

import { PageHero } from "@/components/breadcrumb";
import { Icon } from "@/components/icons";
import { getPublishedDoctors, getPublishedServices } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Médecins",
  description:
"L'équipe médicale de l'hôpital « La Croix » de Zinvié : médecins, responsables de service, spécialités et jours de consultation.",
};

type Props = { searchParams: Promise<{ service?: string }> };

export default async function DoctorsPage({ searchParams }: Props) {
  const { service: serviceSlug } = await searchParams;
  const [doctors, services] = await Promise.all([
    getPublishedDoctors(),
    getPublishedServices(),
  ]);

  const serviceBySlug = new Map(services.map((s) => [s.slug, s]));
  const filtered = serviceSlug
    ? doctors.filter((doctor) => {
        const service = doctor.serviceId
          ? services.find((item) => item.id === doctor.serviceId)
          : undefined;
        return service?.slug === serviceSlug;
      })
    : doctors;

  const medecins = filtered.filter((doctor) => doctor.kind === "medecin");
  const equipes = filtered.filter((doctor) => doctor.kind !== "medecin");

  return (
    <>
      <PageHero
        eyebrow="Équipe soignante"
        title="Médecins et équipes de soins"
        subtitle="Les praticiens de l'hôpital « La Croix » de Zinvié et les jours de consultation de chaque spécialité."
        breadcrumb={[{ label: "Médecins" }]}
      />

      <section className="container-page py-14 lg:py-16">
        {/* Filtre par service */}
        <form
          method="get"
          className="card flex flex-col gap-3 p-5 sm:flex-row sm:items-end"
        >
          <div className="flex-1">
            <label htmlFor="service" className="field-label">
              Filtrer par service
            </label>
            <select
              id="service"
              name="service"
              defaultValue={serviceSlug ?? ""}
              className="field-input"
            >
              <option value="">Tous les services</option>
              {services.map((service) => (
                <option key={service.id} value={service.slug}>
                  {service.name}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn btn-primary">
            <Icon name="check" className="h-4 w-4" />
            Filtrer
          </button>
          {serviceSlug ? (
            <Link href="/medecins" className="btn btn-ghost">
              Réinitialiser
            </Link>
          ) : null}
        </form>

        {medecins.length > 0 && (
          <>
            <h2 className="mt-12 text-xl font-bold tracking-tight text-brand-900 sm:text-2xl">
              Médecins
            </h2>
            <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {medecins.map((doctor) => {
                const service = doctor.serviceId
                  ? services.find((item) => item.id === doctor.serviceId)
                  : undefined;
                return (
                  <article
                    key={doctor.id}
                    className="card flex flex-col p-6 transition-shadow "
                  >
                    <div className="flex items-center gap-4">
                      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-700 text-lg font-bold text-white">
                        {doctor.name
                          .split(" ")
                          .slice(0, 2)
                          .map((part) => part[0])
                          .join("")}
                      </span>
                      <div>
                        <h3 className="font-bold leading-tight text-brand-900">
                          {doctor.name}
                        </h3>
                        <p className="mt-1 text-sm font-medium text-cross-600">
                          {doctor.role || doctor.specialty}
                        </p>
                      </div>
                    </div>

                    <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-600">
                      {doctor.bio}
                    </p>

                    <dl className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-sm">
                      <div className="flex items-start gap-2">
                        <Icon
                          name="stethoscope"
                          className="mt-0.5 h-4 w-4 shrink-0 text-brand-600"
                        />
                        <dd className="text-slate-700">{doctor.specialty}</dd>
                      </div>
                      {doctor.days && (
                        <div className="flex items-start gap-2">
                          <Icon
                            name="calendar"
                            className="mt-0.5 h-4 w-4 shrink-0 text-brand-600"
                          />
                          <dd className="text-slate-700">{doctor.days}</dd>
                        </div>
                      )}
                      {doctor.hours && (
                        <div className="flex items-start gap-2">
                          <Icon
                            name="clock"
                            className="mt-0.5 h-4 w-4 shrink-0 text-brand-600"
                          />
                          <dd className="text-slate-700">{doctor.hours}</dd>
                        </div>
                      )}
                      {service && (
                        <div className="flex items-start gap-2">
                          <Icon
                            name="hospital"
                            className="mt-0.5 h-4 w-4 shrink-0 text-brand-600"
                          />
                          <dd>
                            <Link
                              href={`/services/${service.slug}`}
                              className="font-medium text-brand-700 hover:underline"
                            >
                              {service.name}
                            </Link>
                          </dd>
                        </div>
                      )}
                    </dl>
                  </article>
                );
              })}
            </div>
          </>
        )}

        {equipes.length > 0 && (
          <>
            <h2 className="mt-14 text-xl font-bold tracking-tight text-brand-900 sm:text-2xl">
              Consultations de spécialité
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
              Les rendez-vous en spécialité sont possibles notamment en
              chirurgie et en kinésithérapie. Pour les autres spécialités,
              contactez le secrétariat d&apos;accueil pour connaître les
              disponibilités.
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {equipes.map((doctor) => {
                const service = doctor.serviceId
                  ? services.find((item) => item.id === doctor.serviceId)
                  : undefined;
                return (
                  <article key={doctor.id} className="card p-5">
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[3px] bg-brand-50 text-brand-700">
                        <Icon name="users" className="h-5 w-5" />
                      </span>
                      <div>
                        <h3 className="font-semibold leading-tight text-brand-900">
                          {doctor.name}
                        </h3>
                        <p className="text-xs text-slate-500">{doctor.role}</p>
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">
                      {doctor.bio}
                    </p>
                    <div className="mt-4 space-y-1.5 text-sm text-slate-700">
                      {doctor.days && (
                        <p className="flex items-center gap-2">
                          <Icon name="calendar" className="h-4 w-4 text-brand-600" />
                          {doctor.days}
                        </p>
                      )}
                      {doctor.hours && (
                        <p className="flex items-center gap-2">
                          <Icon name="clock" className="h-4 w-4 text-brand-600" />
                          {doctor.hours}
                        </p>
                      )}
                      {service && (
                        <p className="flex items-center gap-2">
                          <Icon name="hospital" className="h-4 w-4 text-brand-600" />
                          <Link
                            href={`/services/${service.slug}`}
                            className="font-medium text-brand-700 hover:underline"
                          >
                            {service.name}
                          </Link>
                        </p>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}

        {filtered.length === 0 && (
          <div className="card mt-10 p-10 text-center">
            <Icon name="users" className="mx-auto h-10 w-10 text-slate-300" />
            <p className="mt-4 font-semibold text-brand-900">
              Aucune équipe affichée pour ce service
            </p>
            <p className="mt-1 text-sm text-slate-600">
             essayez un autre filtre ou contactez l&apos;accueil de l&apos;hôpital.
            </p>
          </div>
        )}
      </section>

      <section className="bg-white py-14">
        <div className="container-page flex flex-col items-center justify-between gap-6 rounded-[4px] bg-brand-50 px-8 py-9 sm:flex-row">
          <div>
            <h2 className="text-lg font-bold text-brand-900">
              Besoin d&apos;un rendez-vous ?
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              L&apos;hôpital vous rappellera pour fixer le rendez-vous.
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
