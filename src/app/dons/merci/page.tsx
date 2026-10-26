import type { Metadata } from "next";
import Link from "next/link";
import { eq } from "drizzle-orm";

import { Icon } from "@/components/icons";
import { DemoPaymentConfirm } from "@/components/public/demo-payment-confirm";
import { db } from "@/db";
import { donations } from "@/db/schema";
import { formatFcfa } from "@/lib/format";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Merci pour votre don",
  description: "Remerciements pour votre don à l'hôpital « La Croix » de Zinvié.",
};

type Props = { searchParams: Promise<{ ref?: string; demo?: string }> };

export default async function DonationThanksPage({ searchParams }: Props) {
  const { ref, demo } = await searchParams;
  const settings = await getSettings();

  let donation: typeof donations.$inferSelect | null = null;
  if (ref) {
    const rows = await db
      .select()
      .from(donations)
      .where(eq(donations.reference, ref))
      .limit(1);
    donation = rows[0] ?? null;
  }

  return (
    <section className="container-page py-16 lg:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-700 text-white ">
          <Icon name="heart" className="h-10 w-10" strokeWidth={1.6} />
        </span>

        <h1 className="mt-7 text-3xl font-bold tracking-tight text-brand-900 sm:text-4xl">
          Merci pour votre don !
        </h1>

        <p className="mt-4 text-lg leading-relaxed text-slate-600">
          Votre don a bien été enregistré. Il sera utilisé pour financer le
          matériel de soin, les examens et l&apos;accompagnement des patients de
          l&apos;hôpital « La Croix » de Zinvié.
        </p>

        {donation && (
          <div className="card mt-8 p-6 text-left">
            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Référence
                </dt>
                <dd className="mt-1 font-semibold text-brand-900">
                  {donation.reference}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Montant
                </dt>
                <dd className="mt-1 font-semibold text-brand-900">
                  {formatFcfa(donation.amount)}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Statut du paiement
                </dt>
                <dd className="mt-1">
                  <span
                    className={`badge ${
                      donation.status === "success"
                        ? "bg-brand-50 text-brand-700"
                        : "bg-sand-200 text-slate-700"
                    }`}
                  >
                    {donation.status === "success"
                      ? "Paiement confirmé"
                      : "Paiement en attente de confirmation"}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Affectation
                </dt>
                <dd className="mt-1 font-semibold text-brand-900">
                  {donation.purpose || "Fonds libres"}
                </dd>
              </div>
            </dl>

            {donation.status !== "success" && demo === "1" && (
              <div className="mt-6 border-t border-slate-100 pt-5">
                <DemoPaymentConfirm reference={donation.reference} />
              </div>
            )}
          </div>
        )}

        <div className="mt-8 rounded-[4px] bg-brand-50 p-6 text-left">
          <h2 className="font-bold text-brand-900">
            Un reçu vous sera délivré
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            L&apos;hôpital vous envoie un reçu et un remerciement par e-mail si
            vous avez renseigné votre adresse lors du don. Pour toute question,
            écrivez-nous à{" "}
            <a
              href={`mailto:${settings.email}`}
              className="font-semibold text-brand-700 underline"
            >
              {settings.email}
            </a>{" "}
            ou appelez le {settings.phone}.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-primary">
            Retour à l&apos;accueil
          </Link>
          <Link href="/actualites" className="btn btn-ghost">
            Voir les actualités de l&apos;hôpital
          </Link>
        </div>
      </div>
    </section>
  );
}
