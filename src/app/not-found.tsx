import type { Metadata } from "next";
import Link from "next/link";

import { PageHero } from "@/components/breadcrumb";
import { Icon } from "@/components/icons";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Page introuvable",
};

export default async function NotFound() {
  const settings = await getSettings();

  return (
    <>
      <PageHero
        eyebrow="Erreur 404"
        title="Cette page est introuvable"
        subtitle="Le lien que vous avez suivi est peut-être ancien ou l'adresse a été mal saisie. Voici comment retrouver rapidement ce que vous cherchez."
        breadcrumb={[{ label: "Page introuvable" }]}
      />

      <section className="container-page py-16">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <h2 className="section-title">Que souhaitez-vous faire ?</h2>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/" className="btn btn-primary">
                <Icon name="hospital" className="h-4 w-4" />
                Retour à l’accueil
              </Link>
              <Link href="/services" className="btn btn-outline">
                Voir nos services
              </Link>
              <Link href="/consultation" className="btn btn-accent">
                <Icon name="calendar" className="h-4 w-4" />
                Demander une consultation
              </Link>
            </div>
            <p className="mt-8 max-w-xl text-sm leading-relaxed text-slate-600">
              Vous pouvez aussi utiliser la recherche du site (bouton
              « Rechercher » en haut de page) pour retrouver un service, un
              médecin ou une actualité.
            </p>
          </div>

          <aside className="card h-fit p-6">
            <h3 className="flex items-center gap-2 font-serif text-lg font-bold text-brand-900">
              <Icon name="ambulance" className="h-5 w-5 text-cross-600" />
              Une urgence ?
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Le service des urgences de l’hôpital est ouvert 24h/24 et 7j/7.
            </p>
            <a
              href={`tel:${settings.phoneEmergency.replace(/\s/g, "")}`}
              className="btn btn-accent mt-5 w-full"
            >
              <Icon name="phone" className="h-4 w-4" />
              {settings.phoneEmergency}
            </a>
            <p className="mt-4 text-center text-xs text-slate-500">
              Accueil : {settings.phone}
            </p>
          </aside>
        </div>
      </section>
    </>
  );
}
