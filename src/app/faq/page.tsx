import type { Metadata } from "next";
import Link from "next/link";

import { PageHero } from "@/components/breadcrumb";
import { Icon } from "@/components/icons";
import { getPublishedFaqs } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Questions fréquentes",
  description:
"Horaires, tarifs, accès, rendez-vous, dons : les réponses aux questions les plus courantes sur l'hôpital « La Croix » de Zinvié.",
};

export default async function FaqPage() {
  const faqs = await getPublishedFaqs();
  const categories = Array.from(new Set(faqs.map((faq) => faq.category)));

  return (
    <>
      <PageHero
        eyebrow="Informations pratiques"
        title="Questions fréquentes"
        subtitle="Horaires, tarifs, accès, prise de rendez-vous, dons : les réponses aux questions les plus courantes."
        breadcrumb={[{ label: "FAQ" }]}
      />

      <section className="container-page py-14 lg:py-16">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <span key={category} className="badge bg-brand-50 text-brand-800">
              {category}
            </span>
          ))}
        </div>

        <div className="mt-8 divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-white">
          {faqs.map((faq) => (
            <details key={faq.id} className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-left font-semibold text-brand-900 transition hover:bg-sand-50">
                <span>{faq.question}</span>
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700 transition group-open:rotate-45">
                  <Icon name="arrow-right" className="h-4 w-4 rotate-45" />
                </span>
              </summary>
              <div className="px-5 pb-5 text-sm leading-relaxed text-slate-600">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          <Link
            href="/consultation"
            className="card group p-6 transition hover:border-brand-300 "
          >
            <Icon name="calendar" className="h-6 w-6 text-cross-600" />
            <h3 className="mt-3 font-bold text-brand-900">Prendre rendez-vous</h3>
            <p className="mt-1 text-sm text-slate-600">
              Envoyez votre demande, l&apos;hôpital vous rappelle.
            </p>
          </Link>
          <Link
            href="/contact"
            className="card group p-6 transition hover:border-brand-300 "
          >
            <Icon name="phone" className="h-6 w-6 text-cross-600" />
            <h3 className="mt-3 font-bold text-brand-900">Nous appeler</h3>
            <p className="mt-1 text-sm text-slate-600">
              Pour toute question sur les horaires ou les soins.
            </p>
          </Link>
          <Link
            href="/dons"
            className="card group p-6 transition hover:border-brand-300 "
          >
            <Icon name="hand-heart" className="h-6 w-6 text-cross-600" />
            <h3 className="mt-3 font-bold text-brand-900">Faire un don</h3>
            <p className="mt-1 text-sm text-slate-600">
              MTN MoMo, Moov Money ou carte bancaire.
            </p>
          </Link>
        </div>
      </section>
    </>
  );
}
