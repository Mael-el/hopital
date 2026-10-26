import Image from "next/image";
import Link from "next/link";

import { Icon, type IconName } from "@/components/icons";
import { EmergencyPanel } from "@/components/public/emergency-panel";
import {
  getHomePage,
  getPrincipalServices,
  getPublishedNews,
} from "@/lib/content";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

type Stat = { value: string; label: string };
type Pillar = { title: string; text: string; icon: string };

export default async function HomePage() {
  const [home, principal, latestNews] = await Promise.all([
    getHomePage(),
    getPrincipalServices(),
    getPublishedNews(3),
  ]);

  const data = (home.data ?? {}) as {
    heroKicker?: string;
    heroTitle?: string;
    heroText?: string;
    stats?: Stat[];
    pillars?: Pillar[];
  };

  const stats = data.stats ?? [];
  const pillars = data.pillars ?? [];

  return (
    <>
      {/* ============================ HERO ============================ */}
      <section className="border-b border-sand-200">
        <div className="container-page grid items-stretch gap-0 lg:grid-cols-[1.02fr_1fr]">
          {/* Colonne texte */}
          <div className="flex flex-col justify-center py-12 lg:py-20 lg:pr-14">
            <p className="section-label">{data.heroKicker ?? "Bénin · Atlantique · Zinvié"}</p>

            <h1 className="mt-6 font-serif text-[2.1rem] font-bold leading-[1.12] tracking-tight text-brand-900 sm:text-[2.7rem] lg:text-[3.1rem]">
              {data.heroTitle ?? "Des soins accessibles, un accompagnement humain"}
            </h1>

            <div className="mt-6 h-px w-20 bg-cross-500" />

            <p className="mt-6 max-w-xl text-[1.02rem] leading-[1.8] text-slate-600">
              {data.heroText ?? home.subtitle}
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/consultation" className="btn btn-accent">
                <Icon name="calendar" className="h-4 w-4" />
                Demander une consultation
              </Link>
              <Link href="/dons" className="btn btn-primary">
                <Icon name="hand-heart" className="h-4 w-4" />
                Faire un don
              </Link>
            </div>

            <dl className="mt-10 grid gap-5 border-t border-sand-200 pt-7 sm:grid-cols-2">
              <div className="flex gap-3">
                <Icon name="ambulance" className="mt-0.5 h-4 w-4 shrink-0 text-cross-600" />
                <div>
                  <dt className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-slate-500">
                    Urgences
                  </dt>
                  <dd className="mt-0.5 text-sm font-medium text-slate-700">
                    24h/24 et 7j/7 — +229 97 21 48 39
                  </dd>
                </div>
              </div>
              <div className="flex gap-3">
                <Icon name="map" className="mt-0.5 h-4 w-4 shrink-0 text-brand-700" />
                <div>
                  <dt className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-slate-500">
                    Situation
                  </dt>
                  <dd className="mt-0.5 text-sm font-medium text-slate-700">
                    Yêvié, Route de Zinvié — 40 km de Cotonou
                  </dd>
                </div>
              </div>
            </dl>
          </div>

          {/* Colonne image : la photo de l'hôpital */}
          <div className="relative h-64 border-sand-200 bg-sand-100 sm:h-96 lg:h-auto lg:min-h-[34rem] lg:border-l">
            <Image
              src="/images/hero-hopital.jpg"
              alt="Le bâtiment de l'hôpital « La Croix » de Zinvié"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-brand-950/90 px-6 py-5 backdrop-blur-[2px]">
              <p className="font-serif text-lg font-semibold text-white">
                Hôpital « La Croix » de Zinvié
              </p>
              <p className="mt-1 text-[0.72rem] uppercase tracking-[0.14em] text-brand-200/75">
                Centre de Santé à Vocation Humanitaire — Fondé en 1974
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================= CHIFFRES CLÉS ======================== */}
      <section className="border-b border-sand-200 bg-sand-100">
        <div className="container-page grid grid-cols-2 divide-sand-200 lg:grid-cols-4 lg:divide-x">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`px-2 py-8 text-center sm:px-6 ${
                index % 2 === 0 ? "border-r border-sand-200 lg:border-r-0" : ""
              } ${index < 2 ? "border-b border-sand-200 lg:border-b-0" : ""}`}
            >
              <p className="font-serif text-3xl font-bold text-brand-800 sm:text-4xl">
                {stat.value}
              </p>
              <p className="mt-2 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-slate-500">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <EmergencyPanel />

      {/* Accès rapides aux services en ligne */}
      <section className="border-b border-sand-200 bg-white">
        <div className="container-page grid gap-px bg-sand-200 sm:grid-cols-3">
          {[
            {
              href: "/triage",
              icon: "stethoscope" as IconName,
              title: "Quel service consulter ?",
              text: "Orientation personnalisée en 5 questions, avec le délai de consultation conseillé.",
            },
            {
              href: "/consultation",
              icon: "calendar" as IconName,
              title: "Demander une consultation",
              text: "Envoyez votre demande : l'hôpital vous rappelle pour fixer le rendez-vous.",
            },
            {
              href: "/fiche-imprimable",
              icon: "book" as IconName,
              title: "Fiche pratique imprimable",
              text: "Services, horaires, contacts et urgences : la fiche à emporter avec vous.",
            },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-start gap-4 bg-white p-7 transition hover:bg-brand-50/70"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[3px] bg-brand-50 text-brand-700">
                <Icon name={item.icon} className="h-5 w-5" />
              </span>
              <span>
                <span className="block font-serif text-lg font-bold text-brand-900">
                  {item.title}
                </span>
                <span className="mt-1.5 block text-sm leading-relaxed text-slate-600">
                  {item.text}
                </span>
                <span className="mt-3 inline-flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-brand-700">
                  Accéder
                  <Icon
                    name="arrow-right"
                    className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
                  />
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ========================= PRÉSENTATION ======================= */}
      <section className="container-page py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.12fr_0.88fr]">
          <div>
            <p className="section-label">Qui sommes-nous</p>
            <h2 className="section-title mt-5">
              Une structure sanitaire confessionnelle au service de Zinvié
            </h2>
            <div className="mt-7 prose-hospital text-slate-600">
              {home.body.split("\n\n").map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
            <Link href="/a-propos" className="btn btn-outline mt-8">
              Découvrir notre histoire
              <Icon name="arrow-right" className="h-4 w-4" />
            </Link>
          </div>

          <div className="border-t border-sand-200 lg:border-t-0">
            {pillars.map((pillar, index) => (
              <div
                key={pillar.title}
                className="flex gap-5 border-b border-sand-200 py-6 first:pt-0 lg:first:pt-0"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[3px] bg-brand-50 text-brand-700">
                  <Icon
                    name={(pillar.icon as IconName) ?? "heart"}
                    className="h-5 w-5"
                  />
                </span>
                <div>
                  <p className="font-serif text-lg font-bold text-brand-900">
                    {pillar.title}
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                    {pillar.text}
                  </p>
                </div>
                <span className="ml-auto hidden font-serif text-2xl text-sand-300 sm:block">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================== SERVICES ========================= */}
      <section className="border-y border-sand-200 bg-sand-100 py-16 lg:py-20">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="section-label">Plateau technique</p>
              <h2 className="section-title mt-5">
                Les 7 services principaux de l&apos;hôpital
              </h2>
            </div>
            <Link href="/services" className="btn btn-ghost">
              Tous les services
              <Icon name="arrow-right" className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10 grid gap-px border border-sand-200 bg-sand-200 sm:grid-cols-2 lg:grid-cols-3">
            {principal.map((service) => (
              <Link
                key={service.id}
                href={`/services/${service.slug}`}
                className="group flex flex-col bg-white p-7 transition-colors hover:bg-brand-50/60"
              >
                <Icon
                  name={(service.icon as IconName) ?? "stethoscope"}
                  className="h-7 w-7 text-brand-700"
                />
                <h3 className="mt-5 font-serif text-lg font-bold text-brand-900">
                  {service.name}
                </h3>
                <p className="mt-2.5 flex-1 text-sm leading-relaxed text-slate-600">
                  {service.shortDescription}
                </p>
                <span className="mt-5 flex items-center gap-2 border-t border-sand-200 pt-4 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-brand-700">
                  Fiche du service
                  <Icon
                    name="arrow-right"
                    className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
                  />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ====================== IMAGE + CITATION ====================== */}
      <section className="relative isolate overflow-hidden">
        <Image
          src="/images/equipe-soins.jpg"
          alt="L'équipe soignante de l'hôpital La Croix de Zinvié"
          fill
          sizes="100vw"
          className="-z-10 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-brand-950/85" />
        <div className="container-page py-20 lg:py-28">
          <div className="max-w-3xl">
            <Icon name="heart" className="h-8 w-8 text-cross-300" />
            <blockquote className="mt-7 font-serif text-2xl font-semibold leading-[1.45] text-white sm:text-[1.75rem]">
              « Une particularité chez nous : la présence d&apos;une aumônerie,
              qui s&apos;occupe de l&apos;accompagnement et de l&apos;écoute des
              malades. Par ailleurs, la collaboration occupe une place très
              importante dans notre système. »
            </blockquote>
            <p className="mt-7 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-brand-200/70">
              Hôpital « La Croix » de Zinvié — Religieux Camilliens
            </p>
          </div>
        </div>
      </section>

      {/* ========================= ACTUALITÉS ========================= */}
      <section className="container-page py-16 lg:py-20">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="section-label">Vie de l&apos;hôpital</p>
            <h2 className="section-title mt-5">
              Les dernières actualités
            </h2>
          </div>
          <Link href="/actualites" className="btn btn-ghost">
            Toutes les actualités
            <Icon name="arrow-right" className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {latestNews.map((item) => (
            <article
              key={item.id}
              className="group flex flex-col border-t-2 border-brand-800 pt-6"
            >
              <div className="flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.12em]">
                <span className="text-cross-600">{item.category}</span>
                <span className="h-px flex-1 bg-sand-300" />
                <span className="text-slate-500">
                  {formatDate(item.publishedAt)}
                </span>
              </div>
              <h3 className="mt-4 font-serif text-xl font-bold leading-snug text-brand-900">
                <Link href={`/actualites/${item.slug}`} className="hover:text-brand-700">
                  {item.title}
                </Link>
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">
                {item.excerpt}
              </p>
              <Link
                href={`/actualites/${item.slug}`}
                className="mt-5 inline-flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-brand-700"
              >
                Lire la suite
                <Icon name="arrow-right" className="h-3.5 w-3.5" />
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* ============================== DON ============================ */}
      <section className="border-t-4 border-cross-600 bg-brand-950 py-16 text-white lg:py-20">
        <div className="container-page grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-cross-300">
              Faire un don
            </p>
            <h2 className="mt-5 font-serif text-2xl font-bold leading-tight text-white sm:text-[2rem]">
              Votre don soutient nos patients les plus vulnérables
            </h2>
            <div className="mt-6 h-px w-16 bg-cross-500" />
            <p className="mt-6 leading-relaxed text-brand-100/80">
              Vos contributions financent l&apos;équipement du bloc opératoire, le
              scanner, la crèche de la maternité, la banque du sang et nos
              campagnes de santé communautaire. Paiement sécurisé par{" "}
              <strong className="text-white">FedaPay</strong> : MTN Mobile Money,
              Moov Money ou carte bancaire.
            </p>
            <Link href="/dons" className="btn btn-accent mt-8">
              <Icon name="hand-heart" className="h-4 w-4" />
              Donner maintenant
            </Link>
          </div>

          <div className="border-t border-white/15 lg:border-t-0">
            {[
              {
                icon: "activity" as IconName,
                title: "Bloc opératoire",
                text: "Respirateurs, matériel d'anesthésie et de réanimation.",
              },
              {
                icon: "scan" as IconName,
                title: "Scanner",
                text: "Éviter des déplacements coûteux vers Cotonou.",
              },
              {
                icon: "baby" as IconName,
                title: "Crèche de maternité",
                text: "Accueil et soins des nouveau-nés hospitalisés.",
              },
              {
                icon: "droplet" as IconName,
                title: "Banque du sang",
                text: "Campagnes de don de sang en zone rurale.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-5 border-b border-white/15 py-5"
              >
                <Icon name={item.icon} className="mt-1 h-5 w-5 shrink-0 text-cross-300" />
                <div>
                  <h3 className="font-serif text-lg font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm text-brand-100/70">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
