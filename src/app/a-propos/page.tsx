import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { PageHero } from "@/components/breadcrumb";
import { Icon, type IconName } from "@/components/icons";
import { getAboutPage, getHospitalValues, getTimeline } from "@/lib/content";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "À propos",
  description:
"Histoire, mission, valeurs et direction de l'hôpital « La Croix » de Zinvié, structure confessionnelle créée en 1974 par les Religieux Camilliens.",
};

type Direction = { name: string; role: string; text: string };

export default async function AboutPage() {
  const [about, timeline, values, settings] = await Promise.all([
    getAboutPage(),
    getTimeline(),
    getHospitalValues(),
    getSettings(),
  ]);

  const data = (about.data ?? {}) as {
    missionTitle?: string;
    missionText?: string;
    visionTitle?: string;
    visionText?: string;
    storyIntro?: string;
    directions?: Direction[];
    partnershipText?: string;
  };

  const directions = data.directions ?? [];

  return (
    <>
      <PageHero
        eyebrow="Institutionnel"
        title={about.title}
        subtitle={about.subtitle}
        breadcrumb={[{ label: "À propos" }]}
      />

      {/* ------------------------------ HISTOIRE ---------------------------- */}
      <section className="container-page py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_0.85fr] lg:items-center">
          <div>
            <p className="section-label">Notre histoire</p>
            <h2 className="mt-5 section-title">
              De 1972 à aujourd&apos;hui : une histoire de service
            </h2>
            <div className="mt-6 prose-hospital text-slate-600">
              {(data.storyIntro ?? about.body)
                .split("\n\n")
                .map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
            </div>
          </div>

          <figure className="border border-sand-200 bg-white p-2">
            <div className="relative h-72 bg-sand-100 sm:h-80">
              <Image
                src="/images/hero-hopital.jpg"
                alt="Le bâtiment de l'hôpital « La Croix » de Zinvié"
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
            </div>
            <figcaption className="flex items-start gap-3 px-3 py-4">
              <Icon name="hospital" className="mt-0.5 h-4 w-4 shrink-0 text-brand-700" />
              <span className="text-xs leading-relaxed text-slate-500">
                <strong className="block font-semibold text-brand-900">
                  Yêvié, Route de Zinvié
                </strong>
                Établissement des Religieux Camilliens, en service depuis 1974 —
                40 km de Cotonou, dans la commune d&apos;Abomey-Calavi.
              </span>
            </figcaption>
          </figure>
        </div>

        <div className="relative mx-auto mt-14 h-72 max-w-5xl overflow-hidden rounded-xl bg-sand-100 sm:h-96">
          <Image
            src="/images/equipe-soins.jpg"
            alt="L'équipe soignante de l'hôpital La Croix de Zinvié"
            fill
            sizes="(max-width: 1024px) 100vw, 64rem"
            className="object-cover"
          />
        </div>

        <ol className="relative mx-auto mt-12 max-w-4xl">
          <span
            aria-hidden
            className="absolute left-[1.15rem] top-2 h-[calc(100%-1rem)] w-px bg-gradient-to-b from-brand-200 via-brand-300 to-transparent md:left-1/2"
          />
          {timeline.map((entry, index) => (
            <li
              key={entry.id}
              className={`relative mb-8 flex gap-5 md:w-1/2 ${
                index % 2 === 0
                  ? "md:ml-auto md:pl-10"
                  : "md:flex-row-reverse md:pr-10 md:text-right"
              }`}
            >
              <span className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-4 border-sand-50 bg-brand-700 text-xs font-bold text-white">
                {entry.year.slice(0, 4)}
              </span>
              <div className="card flex-1 p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-cross-600">
                  {entry.year}
                </p>
                <h3 className="mt-1 font-bold text-brand-900">{entry.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {entry.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ------------------------- MISSION & VISION ------------------------- */}
      <section className="bg-white py-16 lg:py-20">
        <div className="container-page grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl bg-brand-900 p-8 text-white sm:p-10">
            <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/10">
              <Icon name="shield" className="h-6 w-6 text-cross-300" />
            </span>
            <h2 className="mt-5 text-xl font-bold sm:text-2xl">
              {data.missionTitle ?? "Notre mission"}
            </h2>
            <p className="mt-4 leading-relaxed text-brand-100/85">
              {data.missionText}
            </p>
          </div>
          <div className="rounded-xl border border-brand-100 bg-brand-50 p-8 sm:p-10">
            <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-white text-brand-700">
              <Icon name="globe" className="h-6 w-6" />
            </span>
            <h2 className="mt-5 text-xl font-bold text-brand-900 sm:text-2xl">
              {data.visionTitle ?? "Notre vision"}
            </h2>
            <p className="mt-4 leading-relaxed text-slate-700">
              {data.visionText}
            </p>
          </div>
        </div>
      </section>

      {/* ---------------------------- EFFECTIF RÉEL ------------------------- */}
      <section className="border-y border-sand-200 bg-sand-100 py-14">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <p className="section-label">L&apos;effectif de l&apos;hôpital</p>
            <h2 className="mt-5 section-title">
              250 personnes au service des malades
            </h2>
            <p className="mt-3 leading-relaxed text-slate-600">
              {settings.populationBasin} : une équipe médicale, paramédicale et
              administrative organisée autour de 12 médecins permanents et de
              6 médecins itinérants, qui se rendent également sur les missions
              extérieures.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-px bg-sand-200 lg:grid-cols-3">
            {settings.staffStats.map((stat) => (
              <div key={stat.label} className="bg-white px-5 py-7 text-center">
                <p className="font-serif text-3xl font-bold text-brand-800">
                  {stat.value}
                </p>
                <p className="mt-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-slate-500">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------ VALEURS ----------------------------- */}
      <section className="container-page py-16 lg:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-label">
            Nos valeurs
          </p>
          <h2 className="mt-3 section-title">
            Trois principes qui guident notre action
          </h2>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {values.map((value) => (
            <div
              key={value.id}
              className="card p-7 text-center transition-shadow "
            >
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-cross-50 text-cross-600">
                <Icon
                  name={(value.icon as IconName) ?? "heart"}
                  className="h-7 w-7"
                />
              </span>
              <h3 className="mt-5 text-lg font-bold text-brand-900">
                {value.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ----------------------------- DIRECTION ---------------------------- */}
      <section className="bg-sand-100 py-16 lg:py-20">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <p className="section-label">
              Direction
            </p>
            <h2 className="mt-3 section-title">
              L&apos;équipe qui dirige l&apos;hôpital
            </h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {directions.map((person) => (
              <div key={person.name} className="card p-7 text-center">
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-700 text-xl font-bold text-white">
                  {person.name
                    .split(" ")
                    .slice(0, 2)
                    .map((part) => part[0])
                    .join("")}
                </span>
                <h3 className="mt-4 font-bold text-brand-900">{person.name}</h3>
                <p className="mt-1 text-sm font-semibold text-cross-600">
                  {person.role}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {person.text}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-xl border border-brand-100 bg-white p-6 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-care-50 text-care-700">
                <Icon name="users" className="h-6 w-6" />
              </span>
              <div>
                <h3 className="font-bold text-brand-900">
                  La collaboration, une force de notre système
                </h3>
                <p className="mt-2 leading-relaxed text-slate-600">
                  {data.partnershipText}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {[
"ANTS",
"Fondation Claudine Talon",
"AMCES",
"Medici in Africa",
"Missions italiennes de chirurgie",
                  ].map((partner) => (
                    <span
                      key={partner}
                      className="badge bg-sand-100 text-brand-800"
                    >
                      {partner}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------ CTA -------------------------------- */}
      <section className="container-page py-16">
        <div className="flex flex-col items-center justify-between gap-6 rounded-xl bg-brand-900 px-8 py-10 text-center text-white sm:flex-row sm:text-left">
          <div>
            <h2 className="text-xl font-bold sm:text-2xl">
              Besoin d&apos;un soin ou d&apos;une information ?
            </h2>
            <p className="mt-2 text-brand-100/85">
              Envoyez votre demande : l&apos;hôpital vous rappellera pour fixer le
              rendez-vous.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/consultation" className="btn btn-accent">
              Demander une consultation
            </Link>
            <Link
              href="/contact"
              className="btn btn-outline border-white/40 text-white hover:bg-white hover:text-brand-900"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
